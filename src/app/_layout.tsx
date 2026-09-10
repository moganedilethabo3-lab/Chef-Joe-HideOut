import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
       
      <Stack.Screen
        name="splash"
        options={{
        headerShown: false,
        }}
      />
       <Stack.Screen
        name="home"
        options={{
        headerShown: false,
        }}
      />

      <Stack.Screen
        name="view"
        options={{
          title: 'view',
        }}
      />

      <Stack.Screen
        name="add"
        options={{
          title: 'add',
        }}
      />
      <Stack.Screen
        name="manage"
        options={{
          title: 'manage',
        }}
      />

      <Stack.Screen
        name="update"
        options={{
          title: 'update',
        }}
      />

    
      <Stack.Screen
        name="delete"
        options={{
          title: 'delete',
        }}
      />
    </Stack>
  );
}