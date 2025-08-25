import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Modal,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import {
  Search,
  Filter,
  X,
} from 'lucide-react-native';

import TransactionController from '../../controllers/TransactionController';
import TransactionCard from '../components/TransactionCard';
import { CATEGORIES, formatCurrency } from '../../utils/constants';

export default function TransactionsScreen() {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Toutes');
  const [selectedType, setSelectedType] = useState('Tous');

  const loadTransactions = async () => {
    try {
      await TransactionController.loadUserTransactions();
      const data = TransactionController.transactions;
      setTransactions(data);
      applyFilters(data, {
        search: searchText,
        category: selectedCategory,
        type: selectedType
      });
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de charger les transactions');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const applyFilters = (transactionList, filters) => {
    const filtered = TransactionController.filterTransactions(filters, transactionList);
    setFilteredTransactions(filtered);
  };

  useFocusEffect(
    useCallback(() => {
      loadTransactions();
    }, [])
  );

  useEffect(() => {
    applyFilters(transactions, {
      search: searchText,
      category: selectedCategory,
      type: selectedType
    });
  }, [searchText, selectedCategory, selectedType, transactions]);

  const onRefresh = () => {
    setRefreshing(true);
    loadTransactions();
  };

  const handleDeleteTransaction = async (transactionId) => {
    Alert.alert(
      'Supprimer la transaction',
      'Êtes-vous sûr de vouloir supprimer cette transaction ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            const result = await TransactionController.deleteTransaction(transactionId);
            if (result.success) {
              loadTransactions();
            } else {
              Alert.alert('Erreur', result.error);
            }
          },
        },
      ]
    );
  };

  const resetFilters = () => {
    setSearchText('');
    setSelectedCategory('Toutes');
    setSelectedType('Tous');
    setShowFilters(false);
  };

  const totalExpenses = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalIncomes = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <Text className="text-gray-600">Chargement...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-white px-6 pt-14 pb-4">
        <Text className="text-2xl font-bold text-gray-900 mb-6">
          Transactions
        </Text>
        <View className="flex-row space-x-3 mb-4">
          <View className="flex-1 relative">
            <Search
              size={20}
              color="#6b7280"
              style={{ position: 'absolute', left: 12, top: 12, zIndex: 10 }}
            />
            <TextInput
              className="bg-gray-100 rounded-xl pl-10 pr-4 py-3 text-gray-900"
              placeholder="Rechercher..."
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
          <TouchableOpacity
            className="bg-gray-100 rounded-xl p-3 items-center justify-center"
            onPress={() => setShowFilters(true)}
          >
            <Filter size={20} color="#6b7280" />
          </TouchableOpacity>
        </View>

        <View className="flex-row space-x-4">
          <View className="flex-1 bg-green-50 rounded-xl p-3">
            <Text className="text-green-600 text-sm">Revenus</Text>
            <Text className="text-green-800 font-bold">
              {formatCurrency(totalIncomes)}
            </Text>
          </View>
          <View className="flex-1 bg-red-50 rounded-xl p-3">
            <Text className="text-red-600 text-sm">Dépenses</Text>
            <Text className="text-red-800 font-bold">
              {formatCurrency(totalExpenses)}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="px-6 py-4">
          {filteredTransactions.length === 0 ? (
            <View className="bg-white rounded-2xl p-8 shadow-sm items-center">
              <Text className="text-gray-500 text-center">
                Aucune transaction trouvée
              </Text>
              {(searchText || selectedCategory !== 'Toutes' || selectedType !== 'Tous') && (
                <TouchableOpacity
                  className="mt-4 bg-gray-200 px-4 py-2 rounded-xl"
                  onPress={resetFilters}
                >
                  <Text className="text-gray-700">Réinitialiser les filtres</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <View className="space-y-3">
              {filteredTransactions.map((transaction) => (
                <View key={transaction.id} className="flex-row items-center">
                  <View className="flex-1">
                    <TransactionCard
                      transaction={transaction}
                      onDelete={handleDeleteTransaction}
                    />
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <Modal
        visible={showFilters}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View className="flex-1 bg-white">
          <View className="px-6 pt-14 pb-6">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-xl font-bold text-gray-900">Filtres</Text>
              <TouchableOpacity onPress={() => setShowFilters(false)}>
                <X size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <View className="mb-6">
              <Text className="text-gray-900 font-medium mb-3">Catégorie</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="flex-row space-x-2">
                  {['Toutes', ...CATEGORIES].map((category) => (
                    <TouchableOpacity
                      key={category}
                      className={`px-4 py-2 rounded-xl ${
                        selectedCategory === category
                          ? 'bg-blue-500'
                          : 'bg-gray-100'
                      }`}
                      onPress={() => setSelectedCategory(category)}
                    >
                      <Text
                        className={`${
                          selectedCategory === category
                            ? 'text-white'
                            : 'text-gray-700'
                        }`}
                      >
                        {category}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>

            <View className="mb-6">
              <Text className="text-gray-900 font-medium mb-3">Type</Text>
              <View className="flex-row space-x-2">
                {['Tous', 'expense', 'income'].map((type) => (
                  <TouchableOpacity
                    key={type}
                    className={`px-4 py-2 rounded-xl ${
                      selectedType === type ? 'bg-blue-500' : 'bg-gray-100'
                    }`}
                    onPress={() => setSelectedType(type)}
                  >
                    <Text
                      className={`${
                        selectedType === type ? 'text-white' : 'text-gray-700'
                      }`}
                    >
                      {type === 'Tous' ? 'Tous' :
                       type === 'expense' ? 'Dépenses' : 'Revenus'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View className="flex-row space-x-3 mt-8">
              <TouchableOpacity
                className="flex-1 bg-gray-200 rounded-xl py-4 items-center"
                onPress={resetFilters}
              >
                <Text className="text-gray-700 font-medium">Réinitialiser</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 bg-blue-500 rounded-xl py-4 items-center"
                onPress={() => setShowFilters(false)}
              >
                <Text className="text-white font-medium">Appliquer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}