import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, isRealFirebase, auth } from './firebase';
import { ResumeData } from '../types';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid || null,
      email: auth?.currentUser?.email || null,
      emailVerified: auth?.currentUser?.emailVerified || null,
      isAnonymous: auth?.currentUser?.isAnonymous || null,
      tenantId: auth?.currentUser?.tenantId || null,
      providerInfo: auth?.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error Details: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

/**
 * Fetches the active resume data from Firestore or Sandbox LocalStorage fallback.
 */
export async function fetchUserResume(userId: string): Promise<ResumeData | null> {
  const path = `resumes/${userId}`;
  if (!isRealFirebase || !db) {
    const localSaved = localStorage.getItem(`ai_resume_builder_data_${userId}`);
    if (localSaved) {
      try {
        return JSON.parse(localSaved);
      } catch (e) {
        console.error('Failed to parse local sandbox resume data', e);
      }
    }
    return null;
  }

  try {
    const docRef = doc(db, 'resumes', userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as ResumeData;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return null;
  }
}

/**
 * Writes the active resume data to Firestore and keeps LocalStorage in sync for offline safety.
 */
export async function saveUserResume(userId: string, data: ResumeData): Promise<void> {
  const path = `resumes/${userId}`;
  
  // Keep local copies updated in parallel for extreme speed & safety
  localStorage.setItem(`ai_resume_builder_data_${userId}`, JSON.stringify(data));

  if (!isRealFirebase || !db) {
    return;
  }

  try {
    const docRef = doc(db, 'resumes', userId);
    await setDoc(docRef, {
      ...data,
      userId,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}
