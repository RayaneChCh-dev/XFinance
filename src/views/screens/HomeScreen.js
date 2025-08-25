import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { 
  Eye, 
  EyeOff, 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight,
  ArrowDownRight,
  Plus
} from 'lucide-react-native';

import { useAuth } from '../../context/AuthContext';
import TransactionController from '../../controllers/TransactionController';
import DashboardController from '../../controllers/DashboardController';
import DashboardChart from '../components/DashboardChart';
import TransactionCard from '../components/TransactionCard';

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [showBalance, setShowBalance] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const transactionData = await TransactionController.getTransactions();
      setTransactions(transactionData);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de charger les données');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const balance = DashboardController.calculateBalance(transactions);
  const monthlyExpenses = DashboardController.getMonthlyExpenses(transactions);
  const monthlyIncome = DashboardController.getMonthlyIncome(transactions);
  const recentTransactions = DashboardController.getRecentTransactions(transactions);
  const chartData = DashboardController.getChartData(transactions);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <Text className="text-gray-600">Chargement...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View className="bg-white px-6 pt-14 pb-6">
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-gray-600 text-sm">Bonjour,</Text>
            <Text className="text-2xl font-bold text-gray-900">
              {user?.nom || 'Utilisateur'}
            </Text>
          </View>
          <TouchableOpacity 
            className="w-12 h-12 bg-gray-100 rounded-full items-center justify-center"
            onPress={() => navigation.navigate('Settings')}
          >
            <Text className="text-xl font-bold text-gray-600">
              {(user?.nom || 'U').charAt(0).toUpperCase()}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Solde principal */}
        <View className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-6 shadow-lg">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-white/80 text-sm">Solde actuel</Text>
            <TouchableOpacity onPress={() => setShowBalance(!showBalance)}>
              {showBalance ? (
                <Eye size={20} color="white" />
              ) : (
                <EyeOff size={20} color="white" />
              )}
            </TouchableOpacity>
          </View>
          <Text className="text-white text-3xl font-bold">
            {showBalance ? formatCurrency(balance) : '••••••'}
          </Text>
        </View>
      </View>

      {/* Stats mensuelles */}
      <View className="px-6 mt-6">
        <Text className="text-gray-900 text-lg font-semibold mb-4">
          Ce mois-ci
        </Text>
        <View className="flex-row space-x-4">
          {/* Revenus */}
          <View className="flex-1 bg-white rounded-2xl p-4 shadow-sm">
            <View className="flex-row items-center mb-2">
              <View className="w-8 h-8 bg-green-100 rounded-full items-center justify-center mr-3">
                <ArrowUpRight size={16} color="#10b981" />
              </View>
              <Text className="text-gray-600 text-sm">Revenus</Text>
            </View>
            <Text className="text-gray-900 text-lg font-bold">
              {formatCurrency(monthlyIncome)}
            </Text>
          </View>

          {/* Dépenses */}
          <View className="flex-1 bg-white rounded-2xl p-4 shadow-sm">
            <View className="flex-row items-center mb-2">
              <View className="w-8 h-8 bg-red-100 rounded-full items-center justify-center mr-3">
                <ArrowDownRight size={16} color="#ef4444" />
              </View>
              <Text className="text-gray-600 text-sm">Dépenses</Text>
            </View>
            <Text className="text-gray-900 text-lg font-bold">
              {formatCurrency(monthlyExpenses)}
            </Text>
          </View>
        </View>
      </View>

      {/* Graphique */}
      <View className="px-6 mt-6">
        <Text className="text-gray-900 text-lg font-semibold mb-4">
          Activité des 7 derniers jours
        </Text>
        <View className="bg-white rounded-2xl p-4 shadow-sm">
          <DashboardChart data={chartData} />
        </View>
      </View>

      {/* Transactions récentes */}
      <View className="px-6 mt-6 mb-6">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-gray-900 text-lg font-semibold">
            Transactions récentes
          </Text>
          <TouchableOpacity 
            onPress={() => navigation.navigate('Transactions')}
            className="flex-row items-center"
          >
            <Text className="text-primary-500 text-sm mr-1">Voir tout</Text>
            <ArrowUpRight size={16} color="#3b82f6" />
          </TouchableOpacity>
        </View>

        {recentTransactions.length === 0 ? (
          <View className="bg-white rounded-2xl p-8 shadow-sm items-center">
            <Text className="text-gray-500 text-center">
              Aucune transaction récente
            </Text>
            <TouchableOpacity 
              className="mt-4 bg-primary-500 px-4 py-2 rounded-xl flex-row items-center"
              onPress={() => navigation.navigate('AddTransaction')}
            >
              <Plus size={16} color="white" />
              <Text className="text-white ml-2 font-medium">
                Ajouter une transaction
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="space-y-3">
            {recentTransactions.map((transaction) => (
              <TransactionCard
                key={transaction.id}
                transaction={transaction}
                onPress={() => {
                  // Navigation vers détail transaction si nécessaire
                }}
              />
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}