import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TextInput,
  Image,
} from 'react-native';
import { Colors, wp, hp, GlobalStyles } from '../../constants';
import { AppText, AppButton, AppCard } from '../../components';
import { supabase } from '../../services/supabase';
import Images from '../../constants/Images';

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isFocusedEmail, setIsFocusedEmail] = useState(false);
  const [isFocusedPassword, setIsFocusedPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      Alert.alert('Login Failed', error.message);
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={GlobalStyles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <View style={styles.content}>

          <View style={styles.header}>
            <Image source={Images.logo} style={styles.logo} resizeMode="contain" />
            <AppText variant="hero" style={styles.title}>Welcome back</AppText>
            <AppText variant="body" style={styles.subtitle}>
              Sign in to continue to TechSoft
            </AppText>
          </View>

          <AppCard style={styles.formCard}>
            <View style={styles.inputContainer}>
              <AppText variant="label" style={styles.label}>Email Address</AppText>
              <TextInput
                style={[styles.input, isFocusedEmail && styles.inputFocused]}
                placeholder="hello@example.com"
                placeholderTextColor={Colors.textMuted}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                onFocus={() => setIsFocusedEmail(true)}
                onBlur={() => setIsFocusedEmail(false)}
              />
            </View>

            <View style={styles.inputContainer}>
              <AppText variant="label" style={styles.label}>Password</AppText>
              <TextInput
                style={[styles.input, isFocusedPassword && styles.inputFocused]}
                placeholder="••••••••"
                placeholderTextColor={Colors.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                onFocus={() => setIsFocusedPassword(true)}
                onBlur={() => setIsFocusedPassword(false)}
              />
            </View>

            <AppButton
              title="Sign In"
              onPress={handleLogin}
              loading={loading}
              style={styles.button}
            />
          </AppCard>

        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: wp(6),
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: hp(5),
  },
  logo: {
    width: wp(20),
    height: wp(20),
    marginBottom: hp(3),
  },
  title: {
    marginBottom: hp(1),
    textAlign: 'center',
  },
  subtitle: {
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  formCard: {
    padding: wp(6),
    paddingBottom: wp(8),
  },
  inputContainer: {
    marginBottom: hp(2.5),
  },
  label: {
    marginBottom: hp(1),
    color: Colors.textSecondary,
  },
  input: {
    backgroundColor: Colors.background,
    borderRadius: wp(3),
    padding: wp(4),
    color: Colors.textPrimary,
    borderWidth: 1.5,
    borderColor: Colors.borderLight,
    fontSize: 16,
  },
  inputFocused: {
    borderColor: Colors.primaryLight,
    backgroundColor: Colors.white,
  },
  button: {
    marginTop: hp(2),
  },
});

export default LoginScreen;
