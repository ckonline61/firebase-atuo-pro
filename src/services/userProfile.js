import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export async function saveUserProfile(user, overrides = {}) {
  if (!user?.uid) return null;

  const profile = {
    uid: user.uid,
    name: overrides.name || user.displayName || 'Auto Pro User',
    email: overrides.email ?? user.email ?? '',
    phone: overrides.phone || user.phoneNumber || '',
    photoURL: overrides.photoURL ?? user.photoURL ?? null,
    provider: overrides.provider || user.providerData?.[0]?.providerId || 'unknown',
    updatedAt: serverTimestamp(),
    lastLoginAt: serverTimestamp()
  };

  const userRef = doc(db, 'users', user.uid);
  const existing = await getDoc(userRef);
  const payload = existing.exists() ? profile : { ...profile, createdAt: serverTimestamp() };

  await setDoc(userRef, payload, { merge: true });

  return profile;
}
