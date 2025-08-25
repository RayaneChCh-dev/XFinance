import React, { useState } from "react";
import { View, Text, ScrollView, Alert, TouchableOpacity, Modal, FlatList } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import CustomInput from "../components/CustomInput";
import TransactionController from "../../controllers/TransactionController";
import { useNavigation } from "@react-navigation/native";
import { CATEGORIES, TRANSACTION_TYPES } from "../../utils/constants";

const schema = yup.object().shape({
  amount: yup.number().positive("Le Amount doit être positif").required("Amount requis"),
  category: yup.string().required("Category requise"),
  description: yup.string(),
  type: yup.string().oneOf(Object.values(TRANSACTION_TYPES)).required("Type requis"),
});

const AddTransactionScreen = () => {
  const navigation = useNavigation();
  const { control, handleSubmit, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { amount: "", category: "", description: "", type: TRANSACTION_TYPES.expense },
  });

  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState({ type: false, category: false });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const result = await TransactionController.addTransaction(data);
      if (result.success) {
        Alert.alert("Succès", "Transaction ajoutée avec succès");
        reset();
        navigation.goBack();
      } else {
        Alert.alert("Erreur", result.error || "Impossible d'ajouter la transaction");
      }
    } catch (error) {
      Alert.alert("Erreur", error.message || "Impossible d'ajouter la transaction");
    } finally {
      setLoading(false);
    }
  };

  const renderModal = (options, value, onChange, closeModal) => (
    <Modal visible={true} transparent animationType="slide">
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white rounded-xl w-4/5 p-4">
          <FlatList
            data={options}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                className="p-3 rounded-lg mb-2 bg-gray-100"
                onPress={() => {
                  onChange(item);
                  closeModal();
                }}
              >
                <Text className="text-gray-800">{item}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity
            className="mt-2 p-3 bg-gray-200 rounded-xl items-center"
            onPress={closeModal}
          >
            <Text>Annuler</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <ScrollView className="flex-1 bg-white p-4">
      <Text className="text-xl font-bold mb-4">Add a transaction</Text>

      <CustomInput name="amount" label="Amount" control={control} keyboardType="numeric" />

      <Controller
        control={control}
        name="category"
        render={({ field: { onChange, value } }) => (
          <View className="mb-4">
            <Text className="mb-2 text-gray-700 font-medium">Category</Text>
            <TouchableOpacity
              className="bg-gray-100 px-4 py-3 rounded-xl"
              onPress={() => setModalVisible((prev) => ({ ...prev, category: true }))}
            >
              <Text className={value ? "text-gray-900" : "text-gray-400"}>
                {value || "Sélectionner une Category"}
              </Text>
            </TouchableOpacity>

            {modalVisible.category &&
              renderModal(CATEGORIES, value, onChange, () =>
                setModalVisible((prev) => ({ ...prev, category: false }))
              )}
          </View>
        )}
      />

      <Controller
        control={control}
        name="type"
        render={({ field: { onChange, value } }) => (
          <View className="mb-4">
            <Text className="mb-2 text-gray-700 font-medium">Type</Text>
            <TouchableOpacity
              className="bg-gray-100 px-4 py-3 rounded-xl"
              onPress={() => setModalVisible((prev) => ({ ...prev, type: true }))}
            >
              <Text className={value ? "text-gray-900" : "text-gray-400"}>
                {value === TRANSACTION_TYPES.expense ? "Expense" : value === TRANSACTION_TYPES.income ? "Income" : "Sélectionner le type"}
              </Text>
            </TouchableOpacity>

            {modalVisible.type &&
              renderModal(Object.values(TRANSACTION_TYPES), value, onChange, () =>
                setModalVisible((prev) => ({ ...prev, type: false }))
              )}
          </View>
        )}
      />

      <CustomInput name="description" label="Description" control={control} />

      <TouchableOpacity
        onPress={handleSubmit(onSubmit)}
        disabled={loading}
        className="mt-4 bg-blue-500 py-3 rounded-xl items-center"
      >
        <Text className="text-white font-medium">{loading ? "Ajout..." : "Ajouter"}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default AddTransactionScreen;