import { initiateWompiPayment } from "../services/payment.service.js";

export const initiatePayment = async (req, res) => {
  const userId = req.user.id;
  const { subscriptionType } = req.body;

  try {
    const { paymentUrl, reference } = await initiateWompiPayment(
      userId,
      subscriptionType
    );
    res.json({ paymentUrl, reference });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al iniciar pago", error: error.message });
  }
};

export const getPaymentHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await getPaymentHistory(userId);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      message: "Error al consultar historial de pagos",
      error: error.message,
    });
  }
};
