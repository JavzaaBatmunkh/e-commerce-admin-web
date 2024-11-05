import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';

interface Category {
  _id: string;
  name: string;
  subcategories: string[];
}

const CategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryName, setCategoryName] = useState('');


  const getCategories = async () => {
    const response = await fetch('https://e-commerce-service-ten.vercel.app//categories');
    const data = await response.json();
    setCategories(data);
  };

  useEffect(() => {
    getCategories();
  }, []);



  const createCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch('https://e-commerce-service-ten.vercel.app//categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: categoryName }),
    });

    if (response.ok) {
      const newCategory = await response.json();
      setCategories([...categories, newCategory]);
      setCategoryName('');
    }
  };



  return (
    <div>
      <Card className='p-6 flex flex-col gap-4 mt-4'>
        <h1>Categories</h1>
        <form onSubmit={createCategory}>
          <Input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Enter category name"
            required
          />
          <Button type="submit">Add Category</Button>
        </form>

        {categories.map(category => (
          <Card key={category._id} className='p-2'>
            <h2>{category.name}</h2>
          </Card>
        ))}

      </Card>



    </div>
  );
};

export default CategoriesPage;
