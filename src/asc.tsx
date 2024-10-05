'use client';

import { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, off } from 'firebase/database';

// Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCPtI0KgL01TA_TKJtj2V8ryIlPvrPapVg',
  authDomain: 'compajn.firebaseapp.com',
  projectId: 'compajn',
  storageBucket: 'compajn.appspot.com',
  messagingSenderId: '533578029706',
  appId: '1:533578029706:web:b9d73a4663b015fe39ab73',
  measurementId: 'G-L08L9REDW4',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

interface FormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  experience: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

export default function FormDataTable() {
  const [formData, setFormData] = useState<FormData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const formsRef = ref(database, 'forms');

    const handleData = (snapshot: any) => {
      setLoading(true);
      setError(null);
      try {
        const data = snapshot.val();
        if (data) {
          const formList = Object.entries(data).map(([key, value]) => ({
            id: key,
            ...(value as FormData),
          }));
          setFormData(formList);
        } else {
          setFormData([]);
        }
      } catch (err) {
        setError('Error fetching data');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    onValue(formsRef, handleData, (err: any) => {
      setError('Error connecting to the database');
      console.error('Error connecting to the database:', err);
      setLoading(false);
    });

    return () => {
      // Cleanup listener on component unmount
      off(formsRef);
    };
  }, []);

  if (loading) {
    return <div className="text-center p-4">جاري تحميل البيانات...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-600">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4" dir="rtl">
      <h2 className="text-2xl font-bold mb-4 text-center">
        بيانات النماذج المقدمة
      </h2>
      {formData.length === 0 ? (
        <p className="text-center">لا توجد بيانات متاحة</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b">الاسم</th>
                <th className="py-2 px-4 border-b">البريد الإلكتروني</th>
                <th className="py-2 px-4 border-b">رقم الهاتف</th>
              </tr>
            </thead>
            <tbody>
              {formData.map((form, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                >
                  <td className="py-2 px-4 border-b">{form.name}</td>
                  <td className="py-2 px-4 border-b">{form.email}</td>
                  <td className="py-2 px-4 border-b">{form.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
