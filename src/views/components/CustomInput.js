import React from "react";
import { View, TextInput, Text } from "react-native";
import { Controller } from "react-hook-form";

const CustomInput = ({ control, name, label, placeholder, keyboardType = "default" }) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <View className="mb-4">
          {label && <Text className="text-gray-700 mb-1">{label}</Text>}
          <TextInput
            className="border border-gray-300 rounded-2xl p-3"
            placeholder={placeholder || label}
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            keyboardType={keyboardType}
          />
          {error && <Text className="text-red-500 text-sm">{error.message}</Text>}
        </View>
      )}
    />
  );
};

export default CustomInput;
