import React from "react";
import { View, Text } from "react-native";
import { VictoryPie } from "victory-native";


const DashboardChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <Text className="text-gray-500 text-center">Aucune donnée à afficher</Text>;
  }

  return (
    <View className="items-center">
      <VictoryPie
        data={data}
        colorScale={["#34d399", "#f87171", "#60a5fa", "#fbbf24"]}
        labels={({ datum }) => `${datum.x}: ${datum.y}`}
        innerRadius={50}
        style={{ labels: { fontSize: 12 } }}
        width={300}
        height={300}
      />
    </View>
  );
};

export default DashboardChart;
