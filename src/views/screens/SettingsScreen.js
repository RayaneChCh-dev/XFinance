import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { useAuth } from "../../context/AuthContext";

const SettingsScreen = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert("Logout", "Voulez-vous vraiment vous déconnecter ?", [
      { text: "Annuler", style: "cancel" },
      { text: "Logout", onPress: logout },
    ]);
  };

  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-2xl font-bold mb-6">Settings</Text>

      <View className="mb-4">
        <Text className="text-gray-600">name</Text>
        <Text className="text-lg">{user?.name}</Text>
      </View>

      <View className="mb-4">
        <Text className="text-gray-600">Email</Text>
        <Text className="text-lg">{user?.email || "example@email.com"}</Text>
      </View>

      <TouchableOpacity
        onPress={handleLogout}
        className="bg-red-500 p-3 rounded-2xl mt-8"
      >
        <Text className="text-white text-center">Log out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SettingsScreen;
