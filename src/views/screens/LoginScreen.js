import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react-native';

import { useAuth } from '../../context/AuthContext';

const schema = yup.object().shape({
  email: yup
    .string()
    .email('Email invalide')
    .required('Email requis'),
  password: yup
    .string()
    .min(6, 'Le mot de passe doit contenir au moins 6 caractères')
    .required('Mot de passe requis'),
});

export default function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: 'demo@carrefour.com',
      password: 'demo123',
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const result = await login(data.email, data.password);
      if (!result.success) {
        Alert.alert('Erreur', result.error);
      }
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue lors de la connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-gray-50"
    >
      <View className="flex-1 justify-center px-6">
        {/* Logo et titre */}
        <View className="items-center mb-12">
          <View className="w-20 h-20 bg-primary-500 rounded-2xl mb-6 items-center justify-center">
            <Text className="text-white text-2xl font-bold">CF</Text>
          </View>
          <Text className="text-3xl font-bold text-gray-900 mb-2">
            Carrefour Finance
          </Text>
          <Text className="text-gray-600 text-center">
            Gérez vos finances en toute simplicité
          </Text>
        </View>

        {/* Formulaire */}
        <View className="space-y-6">
          {/* Email */}
          <View>
            <View className="relative">
              <View className="absolute left-4 top-4 z-10">
                <Mail size={20} color="#6b7280" />
              </View>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className={`bg-white rounded-2xl px-12 py-4 text-gray-900 shadow-sm border ${
                      errors.email ? 'border-red-300' : 'border-gray-200'
                    }`}
                    placeholder="Email"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                )}
              />
            </View>
            {errors.email && (
              <Text className="text-red-500 text-sm mt-2 ml-4">
                {errors.email.message}
              </Text>
            )}
          </View>

          {/* Password */}
          <View>
            <View className="relative">
              <View className="absolute left-4 top-4 z-10">
                <Lock size={20} color="#6b7280" />
              </View>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className={`bg-white rounded-2xl px-12 py-4 pr-12 text-gray-900 shadow-sm border ${
                      errors.password ? 'border-red-300' : 'border-gray-200'
                    }`}
                    placeholder="Mot de passe"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    secureTextEntry={!showPassword}
                  />
                )}
              />
              <TouchableOpacity
                className="absolute right-4 top-4"
                onPress={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff size={20} color="#6b7280" />
                ) : (
                  <Eye size={20} color="#6b7280" />
                )}
              </TouchableOpacity>
            </View>
            {errors.password && (
              <Text className="text-red-500 text-sm mt-2 ml-4">
                {errors.password.message}
              </Text>
            )}
          </View>

          {/* Bouton de connexion */}
          <TouchableOpacity
            className={`bg-primary-500 rounded-2xl py-4 items-center shadow-lg ${
              loading ? 'opacity-50' : ''
            }`}
            onPress={handleSubmit(onSubmit)}
            disabled={loading}
          >
            <Text className="text-white text-lg font-semibold">
              {loading ? 'Connexion...' : 'Se connecter'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Info demo */}
        <View className="mt-8 p-4 bg-blue-50 rounded-2xl">
          <Text className="text-blue-800 text-sm text-center font-medium mb-2">
            🔧 Mode Démonstration
          </Text>
          <Text className="text-blue-600 text-xs text-center">
            Email: demo@carrefour.com{'\n'}Mot de passe: demo123
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}