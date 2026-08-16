import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL } from '../../services/api';
import Constants from 'expo-constants';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Google sign-in is disabled in this build to avoid bundler resolution issues.
  // The UI still shows a Google button; enable the feature by restoring
  // the expo-auth-session provider imports and configuration when ready.

  const handleLogin = async () => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      Alert.alert(
        'Missing Information',
        'Please enter your college email and password.',
      );
      return;
    }

    if (!normalizedEmail.endsWith('@kitsw.ac.in')) {
      Alert.alert(
        'Invalid Email',
        'Please use your official KITSW college email.',
      );
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/auth/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: normalizedEmail,
            password,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        Alert.alert(
          'Login Failed',
          data.message || 'Unable to login. Please try again.',
        );
        return;
      }

      if (!data.token) {
        Alert.alert(
          'Login Error',
          'Authentication token was not received from the server.',
        );
        return;
      }

      // Store JWT securely on the device.
      await SecureStore.setItemAsync(
        'kitsphere_auth_token',
        data.token,
      );

      // Store user information securely.
      await SecureStore.setItemAsync(
        'kitsphere_user',
        JSON.stringify(data.user),
      );

      // Successful login.
      Alert.alert(
        'Welcome to KitSphere',
        `Login successful. Welcome, ${
          data.user?.name || 'Student'
        }!`,
        [
          {
            text: 'Continue',
            onPress: () => {
              router.replace('/(main)/home');
            },
          },
        ],
      );
    } catch (error) {
      console.error('Login request error:', error);

      Alert.alert(
        'Connection Error',
        'Unable to connect to the KitSphere server. Make sure the backend is running and your phone is connected to the same Wi-Fi network as your computer.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.brandSection}>
          <View style={styles.logoMark}>
            <Image
              source={require('../../../assets/images/kitsphere-logo.png')}
              style={styles.logoImage}
            />
          </View>

          <Text style={styles.brand}>KitSphere</Text>

          <Text style={styles.brandSubtitle}>
            Your campus, connected.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>Welcome Back</Text>

          <Text style={styles.description}>
            Sign in with your KitSphere student account to continue.
          </Text>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>College Email</Text>

            <View style={styles.inputContainer}>
              <Ionicons
                name="mail-outline"
                size={20}
                color="#7C879A"
              />

              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="yourname@kitsw.ac.in"
                placeholderTextColor="#667085"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
                style={styles.input}
              />
            </View>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Password</Text>

            <View style={styles.inputContainer}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color="#7C879A"
              />

              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                placeholderTextColor="#667085"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
                style={styles.input}
              />

              <TouchableOpacity
                onPress={() =>
                  setShowPassword((value) => !value)
                }
                activeOpacity={0.7}
                disabled={loading}
              >
                <Ionicons
                  name={
                    showPassword
                      ? 'eye-off-outline'
                      : 'eye-outline'
                  }
                  size={20}
                  color="#7C879A"
                />
              </TouchableOpacity>
            </View>
          </View>

          <Link href="/(auth)/forgot-password" asChild>
            <TouchableOpacity
              style={styles.forgotButton}
              activeOpacity={0.7}
              disabled={loading}
            >
              <Text style={styles.forgotText}>
                Forgot Password?
              </Text>
            </TouchableOpacity>
          </Link>

          <TouchableOpacity
            style={[
              styles.loginButton,
              loading && styles.loginButtonDisabled,
            ]}
            onPress={handleLogin}
            activeOpacity={0.85}
            disabled={loading}
          >
            {loading ? (
              <>
                <ActivityIndicator
                  size="small"
                  color="#FFFFFF"
                />

                <Text style={styles.loginButtonText}>
                  Signing in...
                </Text>
              </>
            ) : (
              <>
                <Text style={styles.loginButtonText}>
                  Login
                </Text>

                <Ionicons
                  name="arrow-forward"
                  size={19}
                  color="#FFFFFF"
                />
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.googleButton, loading && styles.loginButtonDisabled]}
            onPress={() => {
              Alert.alert('Coming Soon', 'Google sign-in will be available soon.');
            }}
            activeOpacity={0.85}
            disabled={loading}
          >
            <Ionicons name="logo-google" size={18} color="#000" />
            <Text style={styles.googleButtonText}>Continue with Google</Text>
          </TouchableOpacity>

          <View style={styles.registerRow}>
            <Text style={styles.registerQuestion}>
              Don't have a KitSphere account?
            </Text>

            <Link href="/(auth)/register" asChild>
              <TouchableOpacity
                activeOpacity={0.7}
                disabled={loading}
              >
                <Text style={styles.registerLink}>
                  Register
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>

        <View style={styles.securityRow}>
          <Ionicons
            name="shield-checkmark-outline"
            size={17}
            color="#5AA9FF"
          />

          <Text style={styles.securityText}>
            Student access is restricted to the official KITSW
            college account.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#05070B',
  },

  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 30,
    justifyContent: 'center',
  },

  brandSection: {
    alignItems: 'center',
    marginBottom: 32,
  },

  logoMark: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: '#102840',
    borderWidth: 1,
    borderColor: '#24517A',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },

  logoImage: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },

  brand: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 0.3,
  },

  brandSubtitle: {
    color: '#7E899B',
    fontSize: 13,
    marginTop: 5,
  },

  card: {
    backgroundColor: '#0B111A',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#202B3A',
    padding: 22,
  },

  title: {
    color: '#FFFFFF',
    fontSize: 27,
    fontWeight: '800',
  },

  description: {
    color: '#8E99AA',
    fontSize: 13,
    lineHeight: 20,
    marginTop: 9,
    marginBottom: 25,
  },

  fieldContainer: {
    marginBottom: 18,
  },

  label: {
    color: '#DDE3EC',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },

  inputContainer: {
    minHeight: 54,
    borderRadius: 15,
    backgroundColor: '#101722',
    borderWidth: 1,
    borderColor: '#263244',
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  input: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
  },

  forgotButton: {
    alignSelf: 'flex-end',
    marginTop: -5,
    marginBottom: 20,
  },

  forgotText: {
    color: '#5FA8FF',
    fontSize: 13,
    fontWeight: '600',
  },

  loginButton: {
    minHeight: 52,
    borderRadius: 15,
    backgroundColor: '#1479E8',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  loginButtonDisabled: {
    opacity: 0.7,
  },

  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },

  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 22,
    gap: 5,
  },

  registerQuestion: {
    color: '#7E899B',
    fontSize: 12,
  },

  registerLink: {
    color: '#5FA8FF',
    fontSize: 12,
    fontWeight: '700',
  },

  googleButton: {
    marginTop: 12,
    minHeight: 52,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },

  googleButtonText: {
    color: '#000',
    fontSize: 15,
    fontWeight: '700',
  },

  securityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    marginTop: 20,
    paddingHorizontal: 8,
  },

  securityText: {
    flex: 1,
    color: '#687386',
    fontSize: 10,
    lineHeight: 15,
    textAlign: 'center',
  },
});

