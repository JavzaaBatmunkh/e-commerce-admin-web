
"use client"
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Pencil, Trash2} from 'lucide-react';
import { Button } from "@/components/ui/button"
import { useRouter, useSearchParams } from 'next/navigation'
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link";
import Menu from "@/components/menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import Image from "next/image";
import dayjs from 'dayjs'
import { useQueryState } from 'nuqs'
import CategoriesPage from "@/components/category";
  

export default function Page() {
    const [productName, setProductName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [productCode, setProductCode] = useState<string>('');
    const [price, setPrice] = useState<number | string>('');
    const [quantity, setQuantity] = useState<number | string>('');
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [filterByPrice, setFilterByPrice] = useQueryState("price", { defaultValue: '' });
    const [filterByCategory, setFilterByCategory] = useQueryState("cat", { defaultValue: '' });
    const [filterByDate, setFilterByDate] = useQueryState("date", { defaultValue: '' });
    const [tab, setTab] = useState<string>("product")
    const [categories, setCategories] = useState<Category[]>([]);
    interface Category {
        _id: string;
        name: string;
        subcategories: string[];
      }
    
    const router = useRouter()
    const searchParams = useSearchParams()
    const create = searchParams.get('create')
    const editingId = searchParams.get('editing')
    const open = create === "new" || !!editingId
    const { toast } = useToast()

    interface Product {
        _id: string;
        productName: string,
        productCode: string,
        price: number,
        quantity: number,
        createdAt: string,
        images?: string[],
        categoryId: string,
        sold: number, 
        types: { color: string, size: string, quantity: number }[]
    }

    const getCategories = async () => {
        const response = await fetch('https://e-commerce-service-ten.vercel.app//categories');
        const data = await response.json();
        setCategories(data);
      };

    function getProducts() {
        fetch(`https://e-commerce-service-ten.vercel.app//products`)
            .then(res => res.json())
            .then(data => setProducts(data))
    }

    async function deleteProduct(id: string) {
        await fetch(`https://e-commerce-service-ten.vercel.app//products/${id}`,
            {
                method: 'DELETE'
            })
            .then(() => getProducts())

    }

    useEffect(() => {
        if (editingId) {
            getProductById(editingId)
        }
    }, [editingId])

    function getProductById(id: string) {
        // console.log(editingId)
        fetch(`https://e-commerce-service-ten.vercel.app//products/${id}`)
            .then(res => res.json())
            .then((data) => {
                // console.log(data)
                setProductName(data.productName),
                    setDescription(data.description),
                    setProductCode(data.productCode),
                    setPrice(data.price),
                    setQuantity(data.quantity)
            })
    }

    useEffect(() => {
        getProducts();
        getCategories();
    }, []);



    useEffect(() => {
        (filterByPrice) &&
            getProductsFilterByPrice()
    }, [filterByPrice, filterByCategory]);

    function onClose() {
        router.push('?')
    }

    function getProductsFilterByPrice() {
        fetch(`https://e-commerce-service-ten.vercel.app//products?price=${filterByPrice}&&cat=${filterByCategory}`)
            .then(res => res.json())
            .then(data => setProducts(data))
    }

    function totalQuantity(types: { quantity: number }[]): number {
        let sum = 0;
        for (let i = 0; i < types.length; i++) {
            sum += types[i].quantity;
        }
        return sum;
    }
    

    return (
        <div className="flex bg-[#FFFFFF] text-black">
            <Toaster />
            <Menu />

            <div className="bg-[#ECEDF0] w-full">
                <div className="px-8">
                    <div className="flex gap-8 pt-4 border-b-2">
                        <div onClick={() => setTab("product")} className={tab === "product" ? "border-b-black border-b-2" : ""}>Бүтээгдэхүүн</div>
                        <div onClick={() => setTab("category")} className={tab === "category" ? "border-b-black border-b-2" : ""}>Ангилал</div>
                    </div>
                    <div className={tab === "product" ? "block" : "hidden"}>
                        <Link href="/products/new" >
                            <Button className="mt-4"> + Бүтээгдэхүүн нэмэх</Button>
                        </Link>

                        <div className="flex gap-8">
                            <Select onValueChange={setFilterByCategory} >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Ангилал" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((category)=>(
                                        <SelectItem value={category._id}>{category.name}</SelectItem>))}   
                                </SelectContent>
                            </Select>

                            <Select onValueChange={setFilterByPrice} >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Үнэ" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">Үнэ өсөхөөр</SelectItem>
                                    <SelectItem value="-1">Үнэ буурахаар</SelectItem>
                                    {/* <SelectItem value="-discount">Хямдралын хувиар</SelectItem> */}
                                </SelectContent>
                            </Select>

                            {/* <Select onValueChange={setFilterByDate} >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Сараар" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">Үнэ өсөхөөр</SelectItem>
                                    <SelectItem value="-1">Үнэ буурахаар</SelectItem>
                                </SelectContent>
                            </Select> */}

                        </div>

                        <div className="mt-4">

                            <Table className="">
                                <TableCaption>Products list</TableCaption>
                                <TableHeader >
                                    <TableRow>
                                        <TableHead className="w-[100px]"></TableHead>
                                        <TableHead>Product Name</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead>Price</TableHead>
                                        <TableHead>Quantity</TableHead>
                                        <TableHead>Sold</TableHead>
                                        <TableHead >Date</TableHead>
                                        <TableHead className="text-right"></TableHead>

                                    </TableRow>
                                </TableHeader>
                                <TableBody>

                                    {products?.map(p =>
                                        <TableRow key={p._id}>
                                            <TableCell className="font-medium">
                                                {p?.images && p?.images?.length > 0 &&
                                                    <div className="w-14 h-14 rounded-full overflow-hidden">
                                                        {p?.images[0] && <Image alt="" src={p.images[0]} width={100} height={100} />}
                                                    </div>
                                                }

                                            </TableCell>
                                            <TableCell>{p?.productName}</TableCell>
                                            <TableCell>{p?.categoryId}</TableCell>
                                            <TableCell>{p?.price}</TableCell>
                                            <TableCell>
                                                {totalQuantity(p?.types)}                 
                                            </TableCell>

                                            <TableCell>{p?.sold}</TableCell>
                                            {p?.createdAt ?
                                                <TableCell>
                                                    {dayjs(p.createdAt).format('YYYY-MM-DD')}
                                                </TableCell> :
                                                <TableCell></TableCell>}
                                            <TableCell className="text-right text-[4px] flex gap-4 text-slate-400">
                                                <Link href={`/products/${p._id}`}><button><Pencil /></button></Link>
                                                <button onClick={() => deleteProduct(p._id)}><Trash2 /></button>
                                            </TableCell>
                                        </TableRow>
                                    )}

                                </TableBody>
                    

                            </Table>
                        </div>
                    </div>
                    <div className={tab === "category" ? "block" : "hidden"}>
                        <CategoriesPage/>
                       

                    </div>

                </div>
            </div>
        </div>
    );
}

