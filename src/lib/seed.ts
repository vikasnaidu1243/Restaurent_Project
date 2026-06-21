import { db, MenuItem } from './db';

const SEED_MENU: Omit<MenuItem, 'id'>[] = [
  {
    name: 'Truffle Mushroom Crostini',
    description: 'Sautéed wild forest mushrooms infused with white truffle oil, served on toasted artisanal sourdough with fresh whipped ricotta.',
    price: 18.00,
    category: 'appetizers',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    tags: ['Vegetarian', 'Best Seller'],
    available: true
  },
  {
    name: 'Pan-Seared U10 Scallops',
    description: 'Crispy pan-seared jumbo scallops served over a velvet parsnip purée, drizzled with blood orange reduction and microgreens.',
    price: 24.00,
    category: 'appetizers',
    image: 'https://images.unsplash.com/photo-1532636875304-0c8fe119ff91?auto=format&fit=crop&w=800&q=80',
    tags: ['Gluten-Free'],
    available: true
  },
  {
    name: 'Heirloom Tomato & Burrata',
    description: 'Creamy Italian burrata cheese paired with fresh heirloom tomatoes, drizzled with aged balsamic glaze and extra virgin olive oil.',
    price: 19.00,
    category: 'appetizers',
    image: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&w=800&q=80',
    tags: ['Vegetarian', 'Gluten-Free'],
    available: true
  },
  {
    name: 'Wagyu Ribeye Steak',
    description: 'Grade A5 Japanese Wagyu steak cooked to perfection, accompanied by roasted garlic potato mash and red wine demi-glace.',
    price: 65.00,
    category: 'mains',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    tags: ['Gluten-Free', 'Chef\'s Special'],
    available: true
  },
  {
    name: 'Pan-Seared Chilean Sea Bass',
    description: 'Flaky sea bass fillet served with ginger-soy braised baby bok choy, jasmine rice, and a lemongrass coconut broth.',
    price: 48.00,
    category: 'mains',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80',
    tags: ['Gluten-Free'],
    available: true
  },
  {
    name: 'Wild Mushroom & Asparagus Risotto',
    description: 'Slow-simmered Arborio rice with porcini mushrooms, fresh asparagus, Parmigiano-Reggiano, and white wine.',
    price: 32.00,
    category: 'mains',
    image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&w=800&q=80',
    tags: ['Vegetarian', 'Gluten-Free'],
    available: true
  },
  {
    name: 'Roasted Duck Breast',
    description: 'Crisp-skinned duck breast served with sweet potato purée, glazed baby carrots, and an exquisite sour cherry sauce.',
    price: 42.00,
    category: 'mains',
    image: 'https://images.unsplash.com/photo-1514516345957-556ca7d90a29?auto=format&fit=crop&w=800&q=80',
    tags: ['Gluten-Free'],
    available: true
  },
  {
    name: 'Dark Chocolate Soufflé',
    description: 'Decadent 70% dark Belgian chocolate soufflé served warm with a scoop of house-made Tahitian vanilla bean gelato.',
    price: 16.00,
    category: 'desserts',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
    tags: ['Vegetarian', 'Best Seller'],
    available: true
  },
  {
    name: 'Madagascar Vanilla Crème Brûlée',
    description: 'Silky rich vanilla custard topped with a layer of hardened caramelized sugar and fresh berries.',
    price: 14.00,
    category: 'desserts',
    image: 'https://images.unsplash.com/photo-1470324161839-ce2bb6fa6bc3?auto=format&fit=crop&w=800&q=80',
    tags: ['Vegetarian', 'Gluten-Free'],
    available: true
  },
  {
    name: 'Meyer Lemon Tart',
    description: 'Zesty Meyer lemon curd in a buttery shortbread crust, topped with toasted Italian meringue.',
    price: 15.00,
    category: 'desserts',
    image: 'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=800&q=80',
    tags: ['Vegetarian'],
    available: true
  },
  {
    name: 'Smoked Rosemary Old Fashioned',
    description: 'Premium bourbon whiskey, aromatic bitters, orange peel, and raw cane sugar, smoked table-side with fresh rosemary.',
    price: 18.00,
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=800&q=80',
    tags: ['Vegan', 'Gluten-Free'],
    available: true
  },
  {
    name: 'Hibiscus Lavender Mocktail',
    description: 'A refreshing effervescent infusion of brewed hibiscus, lavender syrup, fresh lime juice, and sparkling mineral water.',
    price: 12.00,
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&w=800&q=80',
    tags: ['Vegan', 'Gluten-Free'],
    available: true
  }
];

export async function seedIfNeeded() {
  const currentMenu = await db.getMenu();
  if (currentMenu.length === 0) {
    console.log('Seeding menu data...');
    for (const item of SEED_MENU) {
      await db.addMenuItem(item);
    }
  }
}
