import * as React from "react"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal, Plus , Bold , Italic , Underline , List, Link, Image ,Gift , Share} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import axios from 'axios'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { SheetContent, SheetHeader, SheetTitle, SheetTrigger , Sheet , SheetFooter } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { SelectValue , Select , SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import { Textarea } from "@/components/ui/textarea"




export const columns = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox 
        className="border-blue-500"
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        className="border-blue-500"
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "nom",
    header: "Categories",
    cell: ({ row }) => (
      <div className="capitalize flex gap-1">
        <div className="h-12 w-12 bg-muted p-2 flex items-center rounded-xs">
          <img src={row.original.image}/>
        </div>
        <div className="space-y-2">
          <div>{row.getValue("nom")}</div>
          <div className="text-sm text-gray-500">{row.original.description}</div>
        </div>
        
    </div>
    ),
  },
  {
    accessorKey: "produittotal",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Produits Total
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("produittotal")}</div>,
  },
  {
    accessorKey: "MontantTotal",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Montant Total
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("categoriescd")}</div>,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(payment.id)}
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export  default function Categories() {
  


  const [sorting, setSorting] = React.useState([])
  const [columnFilters, setColumnFilters] = React.useState([])
  const [columnVisibility, setColumnVisibility] = React.useState({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [data , setData] = React.useState([])
  const [open , setOpen] = React.useState(false)
  const [newCategorie , setewCategorie] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  const fetchCatgorie = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/categories/")
      setData (response.data)
    }catch(error) {
      console.log(error)
    }
  }
  
  React.useEffect(()=>{
    fetchCatgorie()
  } , [])
  const handleChange = (event) => {
    const {value, name} = event.target
    setewCategorie(prev => {
      return  {
        ...prev , 
        [name] : value
      }
    })
  }

  console.log(newCategorie)
  if(data.length ===0) {
    return (
      <div className="flex items-center justify-center p-4 mt-10">
        <div className="w-full max-w-2xl p-6 text-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-20 h-20 bg-icon-color p-4 rounded-full flex items-center justify-center">
              <Gift size={30} strokeWidth={0.5} className="w-full h-full" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold mb-1">
              Créer vos catégories de produits
            </h1>
            <p className="text-gray-500 lg:text-sm text-base font-light mb-6">
              Créez des catégories pour organiser vos produits. Regroupez vos
              produits par type, prix ou caractéristiques pour une gestion
              simplifiée et un contrôle total sur votre inventaire.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Sheet>
                <SheetTrigger className="ml-2" asChild>
                  <Button className="w-full sm:w-auto">
                    <Plus />
                    Ajouter une catégorie
                  </Button>
                </SheetTrigger>

                <form>
                  <SheetContent>
                    <SheetHeader className="border-b bg-muted">
                      <SheetTitle>Ajouter une categorie</SheetTitle>
                    </SheetHeader>
                    <div className="grid gap-6 p-4 overflow-y-scroll">
                      <div className="grid items-center gap-3">
                        <Label htmlFor="nom" className="text-right">
                          Nom
                        </Label>
                        <Input
                          id="nom"
                          value={newCategorie.nom || ""}
                          onChange={handleChange}
                          name="nom"
                          placeholder="Vetements"
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid items-center gap-3">
                        <Label htmlFor="slug" className="text-right">
                          Slug
                        </Label>
                        <Input
                          name="slug"
                          onChange={handleChange}
                          value={newCategorie.slug}
                          id="slug"
                          placeholder="vetement"
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid items-center gap-3">
                        <Label htmlFor="code" className="text-right">
                          Attachement
                        </Label>
                        <input
                          name="image"
                          onChange={handleChange}
                          value={newCategorie.image}
                          className="flex w-full border file:p-2 rounded-md file:bg-muted file:mr-1 shadow-xs"
                          id="image"
                          type="file"
                        />
                      </div>
                      <div className="grid items-center gap-3">
                        <Label htmlFor="parent" className="text-right">
                          Parent Category
                        </Label>
                        <Select>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="parent Category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="vetement">Vetement</SelectItem>
                            <SelectItem value="beaute">Beauté</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid items-center gap-3">
                        <Label htmlFor="parent" className="text-right">
                          Description
                        </Label>
                        <div className="space-y-4">
                          <div className="flex items-center border rounded-md p-1">
                            <ToggleGroup
                              type="multiple"
                              className="flex space-x-1"
                            >
                              <ToggleGroupItem
                                value="bold"
                                aria-label="Toggle bold"
                                className="h-8 w-8 p-0 flex items-center justify-center"
                              >
                                <Bold className="h-4 w-4" />
                              </ToggleGroupItem>
                              <ToggleGroupItem
                                value="italic"
                                aria-label="Toggle italic"
                                className="h-8 w-8 p-0 flex items-center justify-center"
                              >
                                <Italic className="h-4 w-4" />
                              </ToggleGroupItem>
                              <ToggleGroupItem
                                value="underline"
                                aria-label="Toggle underline"
                                className="h-8 w-8 p-0 flex items-center justify-center"
                              >
                                <Underline className="h-4 w-4" />
                              </ToggleGroupItem>
                              <ToggleGroupItem
                                value="list"
                                aria-label="Toggle list"
                                className="h-8 w-8 p-0 flex items-center justify-center"
                              >
                                <List className="h-4 w-4" />
                              </ToggleGroupItem>
                              <ToggleGroupItem
                                value="link"
                                aria-label="Toggle link"
                                className="h-8 w-8 p-0 flex items-center justify-center"
                              >
                                <Link className="h-4 w-4" />
                              </ToggleGroupItem>
                              <ToggleGroupItem
                                value="image"
                                aria-label="Toggle image"
                                className="h-8 w-8 p-0 flex items-center justify-center"
                              >
                                <Image className="h-4 w-4" />
                              </ToggleGroupItem>
                            </ToggleGroup>
                          </div>
                          <Textarea
                            name="description"
                            onChange={handleChange}
                            value={newCategorie.description}
                            id="description"
                            placeholder="Write a Comment..."
                            className="min-h-24 w-full"
                          />
                        </div>
                      </div>
                      <div className="grid items-center gap-3">
                        <Label htmlFor="statut" className="text-right">
                          Statut Categorie
                        </Label>
                        <Select>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="statut categorie" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="true">Active</SelectItem>
                            <SelectItem value="false">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <SheetFooter>
                      <Button type="submit">Ajouter</Button>
                    </SheetFooter>
                  </SheetContent>
                </form>
              </Sheet>
              <Button variant="outline">
                <Share className="mr-2" />
                Partager votre Boutique
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="w-full">
      <div className="">
      <div className="mb-2 space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Catégories</h1>
        <span className="text-sm font-normal">
          Gérer les catégories des produits
        </span>
      </div>
      </div>
      <div className="flex flex-col sm:flex-row items-center py-4 space-y-4 sm:space-y-0 sm:space-x-4">
        <Input
          placeholder="Filter categorie..."
          value={(table.getColumn("nom")?.getFilterValue()) ?? ""}
          onChange={(event) =>
            table.getColumn("nom")?.setFilterValue(event.target.value)
          }
          className="max-w-sm w-full sm:w-auto"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
        <Sheet>
          <SheetTrigger className="ml-2" asChild>
            <Button className="w-full sm:w-auto">
              <Plus />
              Ajouter une catégorie
            </Button>
          </SheetTrigger>

          <form>
            <SheetContent>
              <SheetHeader className="border-b bg-muted">
                <SheetTitle>
                  Ajouter une categorie
                </SheetTitle>
              </SheetHeader>
              <div className="grid gap-6 p-4 overflow-y-scroll">
                <div className="grid items-center gap-3">
                  <Label htmlFor="nom" className="text-right">
                    Nom
                  </Label>
                  <Input 
                    id="nom" 
                    value = {newCategorie.nom || ""}
                    onChange = {handleChange}
                    name = "nom"
                    placeholder="Vetements" 
                    className="col-span-3"
                  />
                </div>
                <div className="grid items-center gap-3">
                  <Label htmlFor="slug" className="text-right">
                    Slug
                  </Label>
                  <Input 
                    name =  "slug"
                    onChange = {handleChange}
                    value = {newCategorie.slug}
                    id="slug" 
                    placeholder="vetement" 
                    className="col-span-3"
                  />
                </div>
                <div className="grid items-center gap-3">
                  <Label htmlFor="code" className="text-right">
                    Attachement
                  </Label>
                  <input 
                    name =  "image"
                    onChange = {handleChange}
                    value = {newCategorie.image}
                    className="flex w-full border file:p-2 rounded-md file:bg-muted file:mr-1 shadow-xs"
                    id="image" 
                    type="file" 
                  />
                </div>
                <div className="grid items-center gap-3">
                  <Label htmlFor="parent" className="text-right">
                    Parent Category
                  </Label>
                  <Select>
                    <SelectTrigger  className = "w-full">
                      <SelectValue placeholder = "parent Category"/>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem  value="vetement">Vetement</SelectItem>
                      <SelectItem value="beaute">Beauté</SelectItem>
                    </SelectContent>
                  </Select>

                </div>
                <div className="grid items-center gap-3">
                  <Label htmlFor="parent" className="text-right">
                    Description
                  </Label>
                  <div className="space-y-4">
                    <div className="flex items-center border rounded-md p-1">
                      <ToggleGroup type="multiple" className="flex space-x-1">
                        <ToggleGroupItem value="bold" aria-label="Toggle bold" className="h-8 w-8 p-0 flex items-center justify-center">
                          <Bold className="h-4 w-4" />
                        </ToggleGroupItem>
                        <ToggleGroupItem value="italic" aria-label="Toggle italic" className="h-8 w-8 p-0 flex items-center justify-center">
                          <Italic className="h-4 w-4" />
                        </ToggleGroupItem>
                        <ToggleGroupItem value="underline" aria-label="Toggle underline" className="h-8 w-8 p-0 flex items-center justify-center">
                          <Underline className="h-4 w-4" />
                        </ToggleGroupItem>
                        <ToggleGroupItem value="list" aria-label="Toggle list" className="h-8 w-8 p-0 flex items-center justify-center">
                          <List className="h-4 w-4" />
                        </ToggleGroupItem>
                        <ToggleGroupItem value="link" aria-label="Toggle link" className="h-8 w-8 p-0 flex items-center justify-center">
                          <Link className="h-4 w-4" />
                        </ToggleGroupItem>
                        <ToggleGroupItem value="image" aria-label="Toggle image" className="h-8 w-8 p-0 flex items-center justify-center">
                          <Image className="h-4 w-4" />
                        </ToggleGroupItem>
                      </ToggleGroup>
                    </div>
                    <Textarea 
                      name =  "description"
                      onChange = {handleChange}
                      value = {newCategorie.description}
                      id="description" 
                      placeholder="Write a Comment..." 
                      className="min-h-24 w-full"
                    />
                  </div>
                </div>
                <div className="grid items-center gap-3">
                  <Label htmlFor="statut" className="text-right">
                    Statut Categorie
                  </Label>
                  <Select>
                    <SelectTrigger  className = "w-full">
                      <SelectValue placeholder = "statut categorie"/>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem  value="true">Active</SelectItem>
                      <SelectItem value="false">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <SheetFooter>
                <Button type="submit">Ajouter</Button>
              </SheetFooter>
            </SheetContent>
          </form>
        </Sheet>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}


/* Si le La catégorie est vides*/
{/* <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl p-6 text-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-20 h-20 bg-icon-color p-4 rounded-full flex items-center justify-center">
            <Gift size={30} strokeWidth={0.5} className="w-full h-full" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold mb-1">
            Créer vos catégories de produits
          </h1>
          <p className="text-gray-500 lg:text-sm text-base font-light mb-6">
            Créez des catégories pour organiser vos produits.
            Regroupez vos produits par type, prix ou caractéristiques pour une gestion simplifiée et un contrôle total sur votre inventaire.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button>Ajouter une Catégorie</Button>
            <Button variant="outline">
              <Share className="mr-2" />
              Partager votre Boutique
            </Button>
          </div>
        </div>
      </div>
    </div> */}