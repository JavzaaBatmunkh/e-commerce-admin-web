"use client";
import { Input } from "@/components/ui/input";
import { ChangeEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Menu from "@/components/menu";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import Link from "next/link";
import { ImageIcon, Plus } from "lucide-react";

export default function Page({ params }: { params: { editingId: string } }) {
  const [productName, setProductName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [productCode, setProductCode] = useState<string>("");
  const [price, setPrice] = useState<number | string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [images, setImages] = useState<string[]>([]);
  const [hidden, setHidden] = useState<boolean>(true);
  const editingId = params.editingId;
  const { toast } = useToast();
  const [files, setFiles] = useState<FileList[]>([]);
  const [color, setColor] = useState<string>("");
  const [size, setSize] = useState<string>("");
  const [quantity, setQuantity] = useState<number | string>("");
  const [types, setTypes] = useState<
    { color: string; size: string; quantity: number }[]
  >([]);
  const [selectedCategoryName, setSelectedCategoryName] = useState<
    string | null
  >(null);
  const [tag, setTag] = useState<string>("");
  const [sold, setSold] = useState<number | string>(0);

  interface Category {
    _id: string;
    name: string;
    subcategories: string[];
  }
  const [categories, setCategories] = useState<Category[]>([]);

  const colors: string[] = ["хар", "цагаан", "ногоон", "хөх", "улаан", "шар"];
  const sizes: string[] = ["Free", "S", "M", "L", "XL", "2XL", "3XL"];

  const getCategories = async () => {
    const response = await fetch("https://e-commerce-service-ten.vercel.app//categories");
    const data = await response.json();
    setCategories(data);
  };

  const addTypeToArray = async () => {
    await setTypes([...types, { color, size, quantity: Number(quantity) }]);
    setQuantity("");
    setColor("");
    setSize("");
  };

  useEffect(() => {
    getCategories();
  }, []);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const imageUrls: string[] = [];
    const newFiles = event.currentTarget.files;
    Array.from(newFiles ?? []).forEach((file) => {
      const imageUrl = URL.createObjectURL(file);
      imageUrls.push(imageUrl);
    });
    setImages((s) => [...s, ...imageUrls]);

    if (newFiles) {
      setFiles([...files, newFiles]);
    }
  };

  const handleUpload = async () => {
    if (!files) return;
    const formData = new FormData();
    files.forEach((fileList) => {
      Array.from(fileList ?? []).forEach((file) => {
        formData.append("image", file, file.name);
      });
    });

    console.log(formData);
    try {
      setLoading(true);
      const response = await fetch("https://e-commerce-service-ten.vercel.app//upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      // console.log(data.secure_url)
      setLoading(false);

      return data;
    } catch (error) {
      console.error("error uploading file:", error);
    }
  };

  function updateProduct(id: string) {
    setLoading(true);

    fetch(`https://e-commerce-service-ten.vercel.app//products/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        productName,
        description,
        productCode,
        price,
        quantity,
      }),
      headers: { "Content-type": "application/json; charset=UTF-8" },
    }).then(() => {
      setLoading(false);
      toast({ description: "Successfully updated." });
      reset();
    });
  }

  async function createProduct() {
    const images = await handleUpload();
    await fetch(`https://e-commerce-service-ten.vercel.app//products`, {
      method: "POST",
      body: JSON.stringify({
        productName,
        description,
        productCode,
        price,
        images: images,
        categoryId: selectedCategoryName,
        types,
        tag,
        sold,
      }),
      headers: { "Content-type": "application/json; charset=UTF-8" },
    });
    await reset();
  }

  function reset() {
    setProductName(""),
      setDescription(""),
      setProductCode(""),
      setPrice(""),
      setImages([]);
    setSelectedCategoryName("");
    setTypes([]);
    setTag("");
  }

  useEffect(() => {
    if (editingId) {
      getProductById(editingId);
    }
  }, [editingId]);

  function getProductById(id: string) {
    fetch(`https://e-commerce-service-ten.vercel.app//products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProductName(data.productName),
          setDescription(data.description),
          setProductCode(data.productCode),
          setPrice(data.price),
          setQuantity(data.quantity);
      });
  }

  return (
    <div className="flex bg-[#FFFFFF] text-black">
      <Menu />
      <div className="bg-slate-100 h-screen text-black w-screen">
        <div className="bg-white px-8 py-4">
          <Link href=""></Link>
          Бүтээгдэхүүн нэмэх
        </div>
        <div className="grid grid-cols-2 gap-8 px-8 pt-8">
          <div className="flex flex-col gap-4">
            <Card>
              <CardContent>
                <Label htmlFor="productName">Бүтээгдэхүүний нэр</Label>
                <Input
                  placeholder="Product Name"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  id="productName"
                />
                <Label htmlFor="description">Нэмэлт мэдээлэл</Label>
                <Input
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  id="description"
                />
                <Label htmlFor="picture">Барааны код</Label>
                <Input
                  placeholder="Product Code"
                  value={productCode}
                  onChange={(e) => setProductCode(e.target.value)}
                />
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <div className="grid w-full max-w-sm items-center gap-1.5 ">
                  <p>Бүтээгдэхүүний зураг</p>
                  <div className="flex gap-1 flex-wrap">
                    {images?.map((i) => (
                      <Card className="w-20 aspect-square flex justify-center items-center overflow-hidden">
                        <Image
                          src={i}
                          width={100}
                          height={100}
                          className="w-20 h-20 object-cover"
                          alt="image"
                        />
                      </Card>
                    ))}
                    <Card className="w-20 aspect-square flex justify-center items-center">
                      <ImageIcon className={loading ? "hidden" : "block"} />
                      <span
                        className={`loading loading-spinner loading-lg ${
                          loading ? "block" : "hidden"
                        }`}
                      ></span>
                    </Card>
                    <Card className="w-20 aspect-square flex justify-center items-center">
                      <ImageIcon className={loading ? "hidden" : "block"} />
                      <span
                        className={`loading loading-spinner loading-lg ${
                          loading ? "block" : "hidden"
                        }`}
                      ></span>
                    </Card>
                    <Card className="w-20 aspect-square flex justify-center items-center">
                      <ImageIcon className={loading ? "hidden" : "block"} />
                      <span
                        className={`loading loading-spinner loading-lg ${
                          loading ? "block" : "hidden"
                        }`}
                      ></span>
                    </Card>
                  </div>
                  <div
                    className="rounded-full w-8 h-8 bg-gray-500 flex justify-center items-center"
                    onClick={() => setHidden((s) => !s)}
                  >
                    <Plus className={loading ? "hidden" : "block"} />
                    <span
                      className={`loading loading-spinner loading-lg ${
                        loading ? "block" : "hidden"
                      }`}
                    ></span>
                  </div>

                  <div className={`${hidden ? "hidden" : ""}`}>
                    <Input type="file" onChange={handleFileChange} multiple />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Label htmlFor="picture">Үндсэн үнэ</Label>
                <Input
                  placeholder="Price"
                  value={price}
                  type="number"
                  onChange={(e) => setPrice(e.target.value)}
                />
              </CardContent>
            </Card>
          </div>
          <div className="flex flex-col gap-4">
            <Card>
              <CardContent>
                Ангилал
                <Select onValueChange={setSelectedCategoryName}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Ангилал cонгох" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                Төрөл
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Өнгө</TableHead>
                      <TableHead>Хэмжээ</TableHead>
                      <TableHead>Үлдэгдэл тоо ширхэг</TableHead>
                      <TableHead className="text-right"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {types?.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.color}</TableCell>
                        <TableCell>{item.size}</TableCell>
                        <TableCell className="text-center">
                          {item.quantity}
                        </TableCell>
                      </TableRow>
                    ))}

                    <TableRow>
                      <TableCell className="font-medium">
                        <Select onValueChange={setColor} value={color}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Өнгө" />
                          </SelectTrigger>
                          <SelectContent>
                            {colors.map((color: string) => (
                              <SelectItem value={color} key={color}>
                                {color}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Select onValueChange={setSize} value={size}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Хэмжээ" />
                          </SelectTrigger>
                          <SelectContent>
                            {sizes.map((size) => (
                              <SelectItem value={size} key={size}>
                                {size}{" "}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Input
                          placeholder="Үлдэгдэл"
                          value={String(quantity)}
                          type="number"
                          onChange={(e) => setQuantity(e.target.value)}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button onClick={addTypeToArray}>
                          <Plus />
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Label htmlFor="picture">Таг</Label>
                <Input
                  placeholder="Таг нэмэх"
                  value={tag}
                  type="text"
                  onChange={(e) => setTag(e.target.value)}
                />
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="px-8 py-4 flex justify-right ">
          {editingId === "new" ? (
            <Button
              onClick={() => {
                createProduct();
              }}
              disabled={loading}
            >
              Submitt
            </Button>
          ) : (
            <Button onClick={() => updateProduct(editingId)} disabled={loading}>
              Update product information
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
