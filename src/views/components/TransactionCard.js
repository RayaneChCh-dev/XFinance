import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Trash2 } from "lucide-react-native";
import { formatCurrency } from "../../utils/constants";

const TransactionCard = ({ transaction, onDelete }) => {
  const isIncome = transaction.type === "income";

  return (
    <View className="flex-row justify-between items-center bg-white shadow p-4 mb-2 rounded-2xl">
      <View>
        <Text className="text-lg font-bold">{transaction.category}</Text>
        <Text className="text-gray-500">{transaction.description}</Text>
        <Text className="text-xs text-gray-400">{new Date(transaction.date).toLocaleDateString()}</Text>
      </View>
      <View className="items-end">
        <Text className={`text-lg font-bold ${isIncome ? "text-green-500" : "text-red-500"}`}>
          {isIncome ? "+" : "-"} {formatCurrency(transaction.amount)}
        </Text>
        {onDelete && (
          <TouchableOpacity onPress={() => onDelete(transaction.id)} className="mt-2">
            <Trash2 size={18} color="red" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default TransactionCard;