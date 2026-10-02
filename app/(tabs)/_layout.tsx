import React from 'react';
import { Tabs, Redirect } from 'expo-router';
import { Text, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, typography } from '../../src/theme';
import { useAuth } from '../../src/modules/auth/AuthProvider';
import { getUserState } from '../../src/store/userStore';

const TAB_CONTENT_HEIGHT = 56;

function TabIcon({
  glyph,
  focused,
}: {
  glyph: string;
  focused: boolean;
}) {
  return (
    <View style={[styles.iconWrap, focused && styles.iconFocused]}>
      <Text style={[styles.icon, focused && styles.iconActive]}>{glyph}</Text>
    </View>
  );
}

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const { ready, session, isMockMode } = useAuth();
  const draft = getUserState().draft;

  // Lift the tab bar fully above Android system nav / gesture bar.
  const bottomInset = Math.max(insets.bottom, 0);
  const tabBarPaddingBottom = bottomInset > 0 ? bottomInset : 8;

  if (!isMockMode && ready && session) {
    if (!draft.age_verified) {
      return <Redirect href="/onboarding/age-gate" />;
    }
    if (!draft.onboarding_complete) {
      return <Redirect href="/onboarding" />;
    }
  }

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerTitleStyle: { ...typography.subtitle, color: colors.text },
        headerShadowVisible: false,
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopColor: colors.borderSubtle,
          borderTopWidth: 1,
          height: TAB_CONTENT_HEIGHT + tabBarPaddingBottom,
          paddingTop: 6,
          paddingBottom: tabBarPaddingBottom,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          letterSpacing: 0.2,
        },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textMuted,
      }}
    >
      <Tabs.Screen
        name="discover"
        options={{
          title: 'Discover',
          tabBarIcon: ({ focused }) => <TabIcon glyph="♡" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="matches"
        options={{
          title: 'Matches',
          tabBarIcon: ({ focused }) => <TabIcon glyph="✦" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          tabBarIcon: ({ focused }) => <TabIcon glyph="◎" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => <TabIcon glyph="◉" focused={focused} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconWrap: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
  },
  iconFocused: {
    backgroundColor: colors.accentSoft,
  },
  icon: {
    fontSize: 16,
    color: colors.textMuted,
  },
  iconActive: {
    color: colors.accent,
  },
});
