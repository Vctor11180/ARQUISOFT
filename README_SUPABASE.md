# Integración Supabase

## 1. Instalar dependencia
(Ya añadida en package.json) Ejecuta:

```
npm install
```

## 2. Variables de entorno Expo
En `app.json` agrega dentro de `expo.extra` (o crea si no existe):

```json
"extra": {
  "expoPublicSupabaseUrl": "https://TU_PROJECT_REF.supabase.co",
  "expoPublicSupabaseAnonKey": "TU_ANON_KEY"
}
```

O mejor usa variables públicas:

En un archivo `.env` (añádelo a `.gitignore`):
```
EXPO_PUBLIC_SUPABASE_URL=https://TU_PROJECT_REF.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=TU_ANON_KEY
```
Expo 53 cargará las que comienzan con EXPO_PUBLIC_.

## 3. Cliente
`lib/supabaseClient.ts` exporta `supabase`.

## 4. Tabla de usuarios
Puedes usar la autenticación integrada de Supabase (tabla `auth.users`) y una tabla perfil:

```sql
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  full_name text,
  avatar_url text,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Public profiles are viewable" on public.profiles
  for select using ( true );

create policy "Users can insert own profile" on public.profiles
  for insert with check ( auth.uid() = id );

create policy "Users can update own profile" on public.profiles
  for update using ( auth.uid() = id );
```

## 5. Registrar usuario (email + password)
```ts
const { data, error } = await supabase.auth.signUp({
  email: 'test@example.com',
  password: '12345678',
  options: {
    data: { full_name: 'Demo' }
  }
});
```

## 6. Login
```ts
const { data, error } = await supabase.auth.signInWithPassword({
  email, password
});
```

## 7. Estado de sesión
```ts
supabase.auth.onAuthStateChange((_event, session)=>{
  // Actualiza tu estado global
});
```

## 8. Insertar perfil después del signUp (si no usas trigger)
```ts
await supabase.from('profiles').insert({ id: user.id, full_name: 'Demo' });
```

## 9. Logout
```ts
await supabase.auth.signOut();
```

## 10. Buenas prácticas
- Usa RLS siempre.
- Nunca guardes service_role key en la app.
- Campos sensibles separados del cliente.
- Usa `EXPO_PUBLIC_` para claves públicas solamente.

