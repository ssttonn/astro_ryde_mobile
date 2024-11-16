import { useStripe } from "@stripe/stripe-react-native";
import React, { memo, useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";

import { fetchAPI } from "@/lib/fetch";
import { PaymentProps } from "@/types/type";

import MainButton from "./MainButton";

const Payment = ({
  fullName,
  email,
  amount,
  driverId,
  rideTime,
}: PaymentProps) => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);

  const confirmHandler = useCallback(
    async (
      paymentMethod: any,
      shouldSavePaymentMethod: any,
      intentCreationCallback: any,
    ) => {
      const { paymentIntent, customer } = await fetchAPI(
        "/(api)/(stripe)/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: fullName || email.split("@")[0],
            email: email,
            amount: amount,
            paymentMethodId: paymentMethod.id,
          }),
        },
      );
      if (paymentIntent.client_secret) {
        const { result } = await fetchAPI("/(api)/(stripe)/pay", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paymentMethodId: paymentMethod.id,
            paymentIntentId: paymentIntent.id,
            customerId: customer,
          }),
        });
        if (result.client_secret) {
        }
      }
    },
    [amount, email, fullName],
  );

  const initializePaymentSheet = useCallback(async () => {
    const { error } = await initPaymentSheet({
      merchantDisplayName: "Astrotify, Inc.",
      returnURL: "astroRyde://stripe-redirect",
      intentConfiguration: {
        mode: {
          amount: 1000,
          currencyCode: "USD",
        },
        confirmHandler: confirmHandler,
      },
      // Set `allowsDelayedPaymentMethods` to true if your business can handle payment
      //methods that complete payment after a delay, like SEPA Debit and Sofort.
      allowsDelayedPaymentMethods: true,
      defaultBillingDetails: {
        name: "Jane Doe",
      },
    });
    if (!error) {
      setLoading(true);
    }
  }, [amount, email, fullName, initPaymentSheet]);

  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      Alert.alert("Success", "Your order is confirmed!");
    }
  };

  useEffect(() => {
    initializePaymentSheet();
  }, [initializePaymentSheet]);

  return (
    <>
      <MainButton
        title="Custom Ride"
        className="my-10 w-full"
        onPress={openPaymentSheet}
      />
    </>
  );
};

export default memo(Payment);
