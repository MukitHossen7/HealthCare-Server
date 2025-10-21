import { Appointment } from "@prisma/client";
import { IJwtPayload } from "../../types/common";
import { prisma } from "../../utils/prisma";
import { v4 as uuidv4 } from "uuid";
import { stripe } from "../../config/stripe.config";
import config from "../../config";
const createAppointment = async (
  payload: Partial<Appointment>,
  user: IJwtPayload
) => {
  const patientData = await prisma.patient.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });

  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      id: payload.doctorId,
      user: {
        isDeleted: false,
      },
    },
  });

  await prisma.doctorSchedules.findFirstOrThrow({
    where: {
      doctorId: doctorData.id,
      scheduleId: payload.scheduleId,
      isBooked: false,
    },
  });

  const videoCallingId = uuidv4();

  const result = await prisma.$transaction(async (tnx) => {
    const appointmentData = await tnx.appointment.create({
      data: {
        patientId: patientData.id,
        doctorId: doctorData.id,
        scheduleId: payload.scheduleId as string,
        videoCallingId: videoCallingId,
      },
    });

    await tnx.doctorSchedules.update({
      where: {
        doctorId_scheduleId: {
          doctorId: doctorData.id,
          scheduleId: payload.scheduleId as string,
        },
      },
      data: {
        isBooked: true,
      },
    });
    const transactionId = uuidv4();

    const paymentData = await tnx.payment.create({
      data: {
        appointmentId: appointmentData.id,
        amount: doctorData.appointmentFee,
        transactionId: transactionId,
      },
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: patientData.email,

      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Appointment with  ${doctorData.name}`,
            },
            unit_amount: doctorData.appointmentFee * 100,
          },
          quantity: 1,
        },
      ],
      metadata: {
        appointmentId: appointmentData.id,
        paymentId: paymentData.id,
      },
      success_url: `${config.STRIPE.success_url}`,
      cancel_url: `${config.STRIPE.cancel_url}`,
    });
    return {
      paymentUrl: session.url,
      appointmentData,
    };
  });
  return result;
};

export const appointmentServices = {
  createAppointment,
};
