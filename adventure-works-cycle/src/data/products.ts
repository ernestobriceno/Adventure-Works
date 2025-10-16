export type Product = { id:string; name:string; price:number; brand:string; image:string; tag?:"new"|"deal"; rating?:number; stock?:"ok"|"low" };
export const products: Product[] = [
{ id:"1", name:"Merida", price:600.5, brand:"MERIDA", image:"https://images.unsplash.com/photo-1518659526055-c9c1a23309ff?q=80&w=1200&auto=format&fit=crop", tag:"new", rating:5, stock:"low" },
{ id:"2", name:"Trek", price:600.5, brand:"TREK", image:"https://images.unsplash.com/photo-1498654200943-1088dd4438ae?q=80&w=1200&auto=format&fit=crop", rating:5 },
{ id:"3", name:"Trek", price:1050, brand:"TREK", image:"https://images.unsplash.com/photo-1517167685280-595076a44a5d?q=80&w=1200&auto=format&fit=crop", rating:5 },
{ id:"4", name:"Trek", price:2550.5, brand:"TREK", image:"https://images.unsplash.com/photo-1520992428834-ce58b4c2d2b2?q=80&w=1200&auto=format&fit=crop", rating:5, stock:"low" },
{ id:"5", name:"Haro", price:600.5, brand:"HARO", image:"https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?q=80&w=1200&auto=format&fit=crop", rating:5 },
{ id:"6", name:"Santa Cruz", price:1050, brand:"SANTA CRUZ", image:"https://images.unsplash.com/photo-1460353581641-37baddab0fa2?q=80&w=1200&auto=format&fit=crop", rating:5 },
];