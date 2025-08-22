import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://127.0.0.1:8000';

const ProductUpdate = () => {
    const { id } = useParams();
    const fileRef = useRef();
    const [produit, setProduit] = useState({ Name: '', prix: 0, url: '' });
    const [name, setName] = useState('');
    const [prix, setPrix] = useState(0); 
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false); 
    const token = localStorage.getItem('token');

    useEffect(() => {
        const getProduit = async () => {
            try {
                const res = await axios.get(`/api/product/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = res.data[0];
                setProduit({ Name: data.name, prix: data.prix, url: data.image_url });
                setName(data.name);
                setPrix(Number(data.prix)); 
            } catch (err) {
                console.error('Fetch error:', err);
                alert('خطأ في تحميل بيانات المنتج');
            }
        };
        getProduit();
    }, [id, token]);

    const handlSubmit = async (e) => {
        e.preventDefault();
        
       
        if (!name.trim()) {
            alert('اسم المنتج مطلوب');
            return;
        }
        
        if (!prix || prix <= 0) {
            alert('السعر مطلوب ويجب أن يكون أكبر من صفر');
            return;
        }

        setLoading(true); // ✅ بدء التحميل

        const formData = new FormData();
        formData.append('_method', 'PUT');
        formData.append('name', name.trim());
        formData.append('prix', prix); 
        if (file) {
            formData.append('path', file); // ✅ الاسم صحيح
        }

        // 🔥 Debug: عرض البيانات المرسلة
        console.log('=== البيانات المرسلة ===');
        for (let [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
        }

        try {
            const response = await axios.post(`/api/product/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });

            alert('تم تحديث المنتج بنجاح!');
            console.log('نجح التحديث:', response.data);
            
            // ✅ تحديث البيانات المعروضة
            if (response.data.data) {
                setProduit({
                    Name: response.data.data.name,
                    prix: response.data.data.prix,
                    url: response.data.data.image_url
                });
            }
            
        } catch (err) {
            console.error('فشل التحديث:', err.response?.data);
            
            if (err.response?.status === 422) {
                const errors = err.response.data.errors;
                const errorMessages = Object.values(errors).flat();
                alert('أخطاء في البيانات:\n' + errorMessages.join('\n'));
            } else if (err.response?.status === 500) {
                alert('خطأ في الخادم. يرجى المحاولة مرة أخرى.');
            } else {
                alert('خطأ في التحديث: ' + (err.response?.data?.message || err.message));
            }
        } finally {
            setLoading(false); 
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold">تحرير المنتج رقم: {id}</h1>
            
            <div className="bg-gray-100 p-4 rounded mt-4">
                <h2 className="text-lg font-semibold mb-2">البيانات الحالية:</h2>
                {produit.url && (
                    <img 
                        src={produit.url} 
                        alt="Product" 
                        className="w-32 h-32 object-cover mt-2 rounded"
                        onError={(e) => {
                            e.target.style.display = 'none';
                            console.error('خطأ في تحميل الصورة');
                        }}
                    />
                )}
                <p><strong>الاسم:</strong> {produit.Name}</p>
                <p><strong>السعر:</strong> {produit.prix} درهم</p>
            </div>

            <form onSubmit={handlSubmit} encType="multipart/form-data" className="mt-6 space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">اسم المنتج:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="أدخل اسم المنتج"
                        className="border p-2 w-full rounded"
                        disabled={loading}
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">السعر (بالدرهم):</label>
                    <input
                        type="number"
                        value={prix}
                        onChange={(e) => setPrix(Number(e.target.value))} 
                        placeholder="أدخل السعر"
                        className="border p-2 w-full rounded"
                        min="0"
                        step="0.01"
                        disabled={loading}
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">صورة جديدة (اختيارية):</label>
                    <input
                        type="file"
                        ref={fileRef}
                        onChange={(e) => setFile(e.target.files[0])}
                        accept="image/*"
                        className="border p-2 w-full rounded"
                        disabled={loading}
                    />
                    <small className="text-gray-500">أقصى حجم: 2 ميجابايت</small>
                </div>

                <button
                    type="submit"
                    className={`w-full px-4 py-2 rounded text-white font-medium ${
                        loading 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-green-500 hover:bg-green-600'
                    }`}
                    disabled={loading}
                >
                    {loading ? 'جاري التحديث...' : 'تحديث المنتج'}
                </button>
            </form>

            <Link
                to="/product"
                className="mt-4 inline-block bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
                العودة إلى قائمة المنتجات
            </Link>
        </div>
    );
};

export default ProductUpdate;