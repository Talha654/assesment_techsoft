import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TextInput,
} from 'react-native';
import { Colors, wp, hp, GlobalStyles } from '../../constants';
import { AppText, AppButton } from '../../components';
import { supabase } from '../../services/supabase';

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

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
          <AppText variant="hero" style={styles.title}>Welcome</AppText>
          <AppText variant="body" style={styles.subtitle}>
            Sign in to your TechSoft account
          </AppText>

          <View style={styles.form}>
            <AppText variant="label" style={styles.label}>Email</AppText>
            <TextInput
              style={styles.input}
              placeholder="email@example.com"
              placeholderTextColor={Colors.textMuted}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <AppText variant="label" style={styles.label}>Password</AppText>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor={Colors.textMuted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <AppButton
              title="Sign In"
              onPress={handleLogin}
              loading={loading}
              style={styles.button}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: wp(8),
    justifyContent: 'center',
  },
  title: {
    marginBottom: hp(1),
  },
  subtitle: {
    marginBottom: hp(4),
  },
  form: {
    width: '100%',
  },
  label: {
    marginBottom: hp(1),
    color: Colors.textSecondary,
  },
  input: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: wp(2),
    padding: wp(4),
    color: Colors.textPrimary,
    marginBottom: hp(2.5),
    borderWidth: 1,
    borderColor: Colors.border,
  },
  button: {
    marginTop: hp(2),
  },
});

export default LoginScreen;
