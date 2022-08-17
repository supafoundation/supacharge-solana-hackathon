import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const config = {
	apiKey: 'AIzaSyBq_0_UdMnZloKZ2ISr8fpDPBoRWZhHiKg',
	authDomain: 'supachat-c09da.firebaseapp.com',
	projectId: 'supachat-c09da',
	storageBucket: 'supachat-c09da.appspot.com',
	messagingSenderId: '113128711488',
	appId: '1:113128711488:web:dacfe7bebb28ad915906a5',
	measurementId: 'G-7V276S9F8X'
}

initializeApp(config)

export const firestoreDb = getFirestore()
export const realtimeDb = getDatabase()
export const storage = getStorage()
