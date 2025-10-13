// Central site menus source compiled from site pages/components
// Minimal structure suitable for menuService.importFromSiteMenus

export interface SiteMenuItem {
  name: string;
  price: number;
  description?: string;
  category: string;
  veg?: boolean;
  image?: string;
}

export const siteMenus: Record<string, SiteMenuItem[]> = {
  'OhSmash': [
    // Burgers
    { name: 'Smash & Grab', price: 8.95, category: 'Burgers', description: 'Signature smash burger with cheese lettuce tomato onion and special sauce' },
    { name: 'Double Trouble', price: 11.95, category: 'Burgers', description: 'Double patty smash burger with special sauce lettuce tomato and onion' },
    { name: 'Magic Mushroom', price: 8.95, category: 'Burgers', description: 'Mushroom and cheese smash burger with lettuce and special sauce', veg: true },
    { name: 'Chic Flick', price: 8.95, category: 'Burgers', description: 'Chicken smash burger with crispy coating lettuce tomato and onion' },
    { name: 'Mac\'abelly', price: 10.95, category: 'Burgers', description: 'Mac and cheese smash burger with crispy coating and special sauce', veg: true },
    
    // Loaded Fries
    { name: 'You Want Beef?', price: 9.95, category: 'Loaded Fries', description: 'Loaded fries with seasoned beef cheese and special sauce' },
    { name: 'She\'s a Hot Chic', price: 9.45, category: 'Loaded Fries', description: 'Loaded fries with crispy chicken hot sauce and cheese' },
    
    // Sides
    { name: 'Seasoned Fries', price: 2.95, category: 'Sides', description: 'Crispy golden fries with our signature seasoning blend', veg: true },
    { name: 'Sweet Potato Fries', price: 3.25, category: 'Sides', description: 'Crispy sweet potato fries with sea salt', veg: true },
    { name: 'Jalapeño Poppers (5)', price: 3.95, category: 'Sides', description: 'Crispy jalapeño poppers stuffed with cream cheese', veg: true },
    { name: 'Chilli Cheese Bites (5)', price: 4.45, category: 'Sides', description: 'Crispy cheese bites with spicy chilli coating', veg: true },
    
    // Drinks
    { name: 'Coca Cola', price: 1.95, category: 'Drinks', description: 'Classic Coca Cola 330ml', veg: true },
    { name: 'Diet Coke', price: 1.95, category: 'Drinks', description: 'Diet Coca Cola 330ml', veg: true },
    { name: 'Fanta Orange', price: 1.95, category: 'Drinks', description: 'Orange Fanta 330ml', veg: true },
    { name: '7up', price: 1.95, category: 'Drinks', description: 'Lemon lime soda 330ml', veg: true },
    { name: 'Water', price: 1.95, category: 'Drinks', description: 'Still water 500ml', veg: true },
    
    // Dessert
    { name: 'Berry Nice', price: 4.95, category: 'Dessert', description: 'Mixed berry dessert with vanilla ice cream', veg: true },
    { name: 'Choc Fudge', price: 4.95, category: 'Dessert', description: 'Rich chocolate fudge cake with chocolate sauce', veg: true },
    { name: 'Ice Cream', price: 4.95, category: 'Dessert', description: 'Vanilla ice cream with choice of toppings', veg: true },
  ],
  
  'Wonder Wings': [
    // Wings
    { name: '8 Pieces (1 Dip)', price: 8.75, category: 'Wings', description: 'Classic chicken wings with 1 dip choice' },
    { name: '10 Pieces (1 Dip)', price: 9.75, category: 'Wings', description: 'Classic chicken wings with 1 dip choice' },
    { name: '12 Pieces (1 Dip)', price: 10.75, category: 'Wings', description: 'Classic chicken wings with 1 dip choice' },
    
    // Boneless
    { name: '8 Pieces (1 Dip)', price: 8.75, category: 'Boneless', description: 'Boneless chicken wings with 1 dip choice' },
    { name: '10 Pieces (1 Dip)', price: 9.75, category: 'Boneless', description: 'Boneless chicken wings with 1 dip choice' },
    { name: '12 Pieces (1 Dip)', price: 10.75, category: 'Boneless', description: 'Boneless chicken wings with 1 dip choice' },
    
    // Tenders
    { name: '3 Pieces (1 Dip)', price: 5.75, category: 'Tenders', description: 'Crispy chicken tenders with 1 dip choice' },
    { name: '5 Pieces (1 Dip)', price: 8.75, category: 'Tenders', description: 'Crispy chicken tenders with 1 dip choice' },
    { name: '8 Pieces (1 Dip)', price: 10.75, category: 'Tenders', description: 'Crispy chicken tenders with 1 dip choice' },
    
    // Wonder Burger
    { name: 'Wonder Burger', price: 7.95, category: 'Wonder Burger', description: 'Classic chicken burger with lettuce tomato and house fries' },
    
    // Wonder Full
    { name: 'Wonder Full', price: 19.95, category: 'Wonder Full', description: '2 Tenders / 6 Boneless or wings / Wonder Burger with House Fries 2 Dips & Drink' },
    
    // Wonder Kids
    { name: 'Wonder Kids', price: 6.95, category: 'Wonder Kids', description: '3 Crispy Tenders House Fries and Fruit Shoot' },
    
    // Sides
    { name: 'House Fries', price: 2.95, category: 'Sides', description: 'Hand cut crispy fries with sea salt', veg: true },
    { name: 'Sweet Potato Fries', price: 3.25, category: 'Sides', description: 'Crispy sweet potato fries with seasoning', veg: true },
    { name: 'House Slaw', price: 3.45, category: 'Sides', description: 'Fresh coleslaw with cabbage and carrots', veg: true },
    { name: 'Mozzarella Sticks (5)', price: 4.25, category: 'Sides', description: 'Crispy mozzarella sticks with marinara sauce', veg: true },
    { name: 'Chilli Cheese Bites (5)', price: 4.45, category: 'Sides', description: 'Crispy cheese bites with spicy chilli coating', veg: true },
    
    // Drinks
    { name: 'Coca Cola', price: 1.95, category: 'Drinks', description: 'Classic Coca Cola 330ml', veg: true },
    { name: 'Diet Coke', price: 1.95, category: 'Drinks', description: 'Diet Coca Cola 330ml', veg: true },
    { name: 'Fanta Orange', price: 1.95, category: 'Drinks', description: 'Orange Fanta 330ml', veg: true },
    { name: '7up', price: 1.95, category: 'Drinks', description: 'Lemon lime soda 330ml', veg: true },
    { name: 'Fruit shoot', price: 1.45, category: 'Drinks', description: 'Fruit flavored drink 200ml', veg: true },
    { name: 'Still Water', price: 1.95, category: 'Drinks', description: 'Still water 500ml', veg: true },
    
    // Wonder Dips
    { name: 'Naga Mayo', price: 0.95, category: 'Wonder Dips', description: 'Spicy mayo dip with chilli', veg: true },
    { name: 'Honey Mustard', price: 0.95, category: 'Wonder Dips', description: 'Sweet honey mustard dip', veg: true },
    { name: 'Buttermilk Ranch', price: 0.95, category: 'Wonder Dips', description: 'Creamy ranch dip', veg: true },
  ],
  
  'Okra Green': [
    // Starters
    { name: 'Onion Bhaji', price: 4.95, category: 'Starters', description: 'Crispy onion fritters with aromatic spices', veg: true },
    { name: 'Sweet Onion Bhaji', price: 5.45, category: 'Starters', description: 'Sweet onion fritters with mild spices', veg: true },
    { name: 'Hot Onion Bhaji', price: 5.45, category: 'Starters', description: 'Spicy onion fritters with chilli', veg: true },
    { name: 'Pineapple Onion Bhaji', price: 5.45, category: 'Starters', description: 'Pineapple onion fritters with sweet spices', veg: true },
    { name: 'Aloo Chaat', price: 5.95, category: 'Starters', description: 'Spiced potato chaat with tamarind and yogurt', veg: true },
    { name: 'Chicken Chaat', price: 5.95, category: 'Starters', description: 'Spiced chicken chaat with tamarind and yogurt' },
    { name: 'Chicken or Lamb Chaat Puri', price: 5.95, category: 'Starters', description: 'Chaat puri with chicken or lamb and spices' },
    { name: 'Lamb Samosa', price: 4.95, category: 'Starters', description: 'Lamb samosa with aromatic spices' },
    { name: 'Vegetable Samosa', price: 4.95, category: 'Starters', description: 'Vegetable samosa with mixed vegetables', veg: true },
    { name: 'Chicken or Lamb Tikka', price: 6.25, category: 'Starters', description: 'Marinated chicken or lamb tikka with spices' },
    { name: 'Naga Chicken Tikka', price: 6.95, category: 'Starters', description: 'Spicy chicken tikka with naga chilli' },
    { name: 'Salmon Tikka', price: 6.95, category: 'Starters', description: 'Marinated salmon tikka with herbs' },
    { name: 'Paneer Tikka', price: 10.95, category: 'Starters', description: 'Marinated paneer tikka with spices', veg: true },
    { name: 'Garlic Mushroom', price: 5.45, category: 'Starters', description: 'Garlic mushroom starter with herbs', veg: true },
    { name: 'Prawn puri', price: 6.45, category: 'Starters', description: 'Prawn puri with spiced prawns' },
    { name: 'King Prawn Puri', price: 8.25, category: 'Starters', description: 'King prawn puri with jumbo prawns' },
    { name: 'King Prawn Butterfly', price: 7.95, category: 'Starters', description: 'King prawn butterfly with spices' },
    { name: 'Tiger King Prawn Butterfly', price: 4.95, category: 'Starters', description: 'Tiger king prawn butterfly with special spices' },
    { name: 'Chicken pakora', price: 6.95, category: 'Starters', description: 'Chicken pakora with gram flour coating' },
    { name: 'Tandoori Chicken', price: 6.45, category: 'Starters', description: 'Tandoori chicken with yogurt marinade' },
    { name: 'Shamee kebab', price: 6.45, category: 'Starters', description: 'Shamee kebab with minced meat and spices' },
    { name: 'Shish kebab', price: 6.25, category: 'Starters', description: 'Shish kebab with marinated meat' },
    { name: 'Reshmi Kebab', price: 6.45, category: 'Starters', description: 'Reshmi kebab with cream and spices' },
    { name: 'Roasted chilli shish kebab', price: 6.95, category: 'Starters', description: 'Roasted chilli shish kebab with spices' },
    { name: 'Special shish kebab', price: 6.95, category: 'Starters', description: 'Special shish kebab with house spices' },
    { name: 'Mixed kebab', price: 7.95, category: 'Starters', description: 'Mixed kebab platter with variety of meats' },
    
    // Signature Dishes
    { name: 'Chicken Achar', price: 9.45, category: 'Signature Dishes', description: 'Chicken with pickle spices and tangy sauce' },
    { name: 'Mango Chicken', price: 9.45, category: 'Signature Dishes', description: 'Chicken with mango curry and sweet spices' },
    { name: 'Mixed Bahar', price: 9.45, category: 'Signature Dishes', description: 'Mixed vegetable curry with seasonal vegetables', veg: true },
    { name: 'Jalai Naga (Spicy)', price: 10.95, category: 'Signature Dishes', description: 'Very spicy chicken curry with naga chilli' },
    { name: 'Butter Chicken or Lamb', price: 9.45, category: 'Signature Dishes', description: 'Creamy tomato curry with butter and cream' },
    { name: 'Murghi Masala', price: 10.45, category: 'Signature Dishes', description: 'Chicken masala curry with aromatic spices' },
    { name: 'Chicken Tikka Malai', price: 11.95, category: 'Signature Dishes', description: 'Chicken tikka in creamy malai sauce' },
    { name: 'Chicken Alkas', price: 9.45, category: 'Signature Dishes', description: 'Chicken alkas curry with special spices' },
    { name: 'Epping Delight', price: 10.45, category: 'Signature Dishes', description: 'House special curry with unique blend of spices' },
    { name: 'Nepali Chingri', price: 16.95, category: 'Signature Dishes', description: 'Nepali prawn curry with Himalayan spices' },
    { name: 'Manchurian Chicken', price: 9.45, category: 'Signature Dishes', description: 'Indo-Chinese chicken with soy sauce' },
    { name: 'Garlic Chilli Chicken or Lamb', price: 10.45, category: 'Signature Dishes', description: 'Garlic chilli curry with fresh garlic' },
    { name: 'Okra Green Special', price: 9.45, category: 'Signature Dishes', description: 'House special curry with secret spices' },
    { name: 'Keema Aloo', price: 9.45, category: 'Signature Dishes', description: 'Minced meat with potato and aromatic spices' },
    { name: 'Chicken or Lamb Palak', price: 9.45, category: 'Signature Dishes', description: 'Spinach curry with fresh spinach' },
    { name: 'Naga Tikka Bhuna', price: 10.45, category: 'Signature Dishes', description: 'Spicy tikka curry with naga chilli' },
    { name: 'Shashlik Bhuna', price: 13.45, category: 'Signature Dishes', description: 'Mixed grill curry with variety of meats' },
    { name: 'Hari Mirchi Bhuna', price: 9.45, category: 'Signature Dishes', description: 'Green chilli curry with fresh chillies' },
    { name: 'Shatkora Chicken', price: 8.95, category: 'Signature Dishes', description: 'Shatkora chicken curry with citrus fruit' },
    { name: 'Chicken or Lamb Khodu', price: 9.25, category: 'Signature Dishes', description: 'Chicken or lamb khodu with special spices' },
    
    // Classic Curries
    { name: 'Curry', price: 8.25, category: 'Classic Curries', description: 'Classic curry sauce with traditional spices' },
    { name: 'Korma', price: 8.25, category: 'Classic Curries', description: 'Mild creamy curry with nuts and cream' },
    { name: 'Vindaloo', price: 8.25, category: 'Classic Curries', description: 'Hot and sour curry with vinegar and spices' },
    { name: 'Phaal', price: 8.25, category: 'Classic Curries', description: 'Very hot curry with extra chilli' },
    { name: 'Dansak', price: 9.45, category: 'Classic Curries', description: 'Sweet and sour curry with lentils' },
    { name: 'Madras', price: 8.25, category: 'Classic Curries', description: 'Medium hot curry with South Indian spices' },
    { name: 'Saag', price: 8.45, category: 'Classic Curries', description: 'Spinach curry with fresh spinach and spices', veg: true },
    { name: 'Bhuna', price: 8.25, category: 'Classic Curries', description: 'Dry fried curry with caramelized onions' },
    { name: 'Ceylon', price: 8.95, category: 'Classic Curries', description: 'Sri Lankan style curry with coconut' },
    { name: 'Rogan Josh', price: 8.25, category: 'Classic Curries', description: 'Lamb curry with aromatic spices' },
    { name: 'Dupiaza', price: 8.25, category: 'Classic Curries', description: 'Onion curry with double onions' },
    { name: 'Pathia', price: 9.45, category: 'Classic Curries', description: 'Sweet and sour curry with tamarind' },
    { name: 'Tofu Curry (Vegan)', price: 9.95, category: 'Classic Curries', description: 'Vegan tofu curry with plant-based protein', veg: true },
    
    // Biriyani
    { name: 'Chicken or Lamb Biriyani', price: 10.95, category: 'Biriyani', description: 'Spiced rice with chicken or lamb and aromatic spices' },
    { name: 'Chicken or Lamb Tikka Biriyani', price: 11.95, category: 'Biriyani', description: 'Spiced rice with tikka and basmati rice' },
    { name: 'Tandoori Chicken Biriyani', price: 10.95, category: 'Biriyani', description: 'Spiced rice with tandoori chicken and saffron' },
    { name: 'Prawn Biriyani', price: 12.45, category: 'Biriyani', description: 'Spiced rice with prawns and aromatic spices' },
    { name: 'Okra Green Special Biriyani', price: 13.45, category: 'Biriyani', description: 'House special biriyani with unique spices' },
    { name: 'King Prawn Biriyani', price: 14.45, category: 'Biriyani', description: 'Spiced rice with king prawns and saffron' },
    { name: 'Tandoori King Prawn Biriyani', price: 16.45, category: 'Biriyani', description: 'Spiced rice with tandoori king prawns' },
    { name: 'Vegetable Biriyani', price: 9.95, category: 'Biriyani', description: 'Spiced rice with mixed vegetables and spices', veg: true },
    
    // Vegetable Side Dishes
    { name: 'Vegetable Curry or Bhaji', price: 4.95, category: 'Vegetable Side Dishes', description: 'Mixed vegetable curry with seasonal vegetables', veg: true },
    { name: 'Cauliflower Bhaji', price: 4.95, category: 'Vegetable Side Dishes', description: 'Cauliflower curry with aromatic spices', veg: true },
    { name: 'Mushroom Bhaji', price: 5.25, category: 'Vegetable Side Dishes', description: 'Mushroom curry with herbs and spices', veg: true },
    { name: 'Okra Green Bhaji', price: 5.25, category: 'Vegetable Side Dishes', description: 'House special vegetable curry with unique spices', veg: true },
    { name: 'Saag Bhaji', price: 4.95, category: 'Vegetable Side Dishes', description: 'Spinach curry with fresh spinach', veg: true },
    { name: 'Brinjal Bhaji', price: 4.95, category: 'Vegetable Side Dishes', description: 'Aubergine curry with aromatic spices', veg: true },
    { name: 'Okra Green Special Bhaji', price: 5.95, category: 'Vegetable Side Dishes', description: 'House special bhaji with secret spices', veg: true },
    { name: 'Aloo Gobi', price: 4.95, category: 'Vegetable Side Dishes', description: 'Potato and cauliflower curry with spices', veg: true },
    { name: 'Aloo Peas', price: 4.95, category: 'Vegetable Side Dishes', description: 'Potato and pea curry with aromatic spices', veg: true },
    { name: 'Bombay Aloo', price: 4.95, category: 'Vegetable Side Dishes', description: 'Spiced potato curry with traditional spices', veg: true },
    { name: 'Tarka Daal', price: 4.45, category: 'Vegetable Side Dishes', description: 'Lentil curry with tempered spices', veg: true },
    { name: 'Chana Masala', price: 4.45, category: 'Vegetable Side Dishes', description: 'Chickpea curry with aromatic spices', veg: true },
    { name: 'Chana Aloo', price: 4.95, category: 'Vegetable Side Dishes', description: 'Chickpea and potato curry with spices', veg: true },
    { name: 'Saag Aloo', price: 4.95, category: 'Vegetable Side Dishes', description: 'Spinach and potato curry with fresh spinach', veg: true },
    { name: 'Daal Saag', price: 4.95, category: 'Vegetable Side Dishes', description: 'Lentil and spinach curry with tempered spices', veg: true },
    { name: 'Motor Paneer', price: 5.25, category: 'Vegetable Side Dishes', description: 'Pea and paneer curry with aromatic spices', veg: true },
    { name: 'Saag Paneer', price: 5.95, category: 'Vegetable Side Dishes', description: 'Spinach and paneer curry with fresh spinach', veg: true },
    { name: 'Saag Mushroom', price: 5.25, category: 'Vegetable Side Dishes', description: 'Spinach and mushroom curry with herbs', veg: true },
    { name: 'Daal Samber', price: 4.95, category: 'Vegetable Side Dishes', description: 'Lentil sambar with South Indian spices', veg: true },
    { name: 'Sauces', price: 4.45, category: 'Vegetable Side Dishes', description: 'Curry sauces with traditional spices', veg: true },
    
    // Okra Green Rice Dishes
    { name: 'Plain Rice', price: 3.30, category: 'Okra Green Rice Dishes', description: 'Basmati rice cooked to perfection', veg: true },
    { name: 'Pilau Rice', price: 3.95, category: 'Okra Green Rice Dishes', description: 'Spiced rice with aromatic spices', veg: true },
    { name: 'Special Fried Rice', price: 4.25, category: 'Okra Green Rice Dishes', description: 'Special fried rice with vegetables and spices', veg: true },
    { name: 'Coconut Fried Rice', price: 4.25, category: 'Okra Green Rice Dishes', description: 'Coconut fried rice with fresh coconut', veg: true },
    { name: 'Onion Fried Rice', price: 4.25, category: 'Okra Green Rice Dishes', description: 'Onion fried rice with caramelized onions', veg: true },
    { name: 'Egg Fried Rice', price: 4.25, category: 'Okra Green Rice Dishes', description: 'Egg fried rice with scrambled eggs' },
    { name: 'Mushroom Fried Rice', price: 4.25, category: 'Okra Green Rice Dishes', description: 'Mushroom fried rice with fresh mushrooms', veg: true },
    { name: 'Lamb Keema Fried Rice', price: 4.95, category: 'Okra Green Rice Dishes', description: 'Lamb keema fried rice with minced lamb' },
    { name: 'Rajma Rice', price: 4.95, category: 'Okra Green Rice Dishes', description: 'Kidney bean rice with aromatic spices', veg: true },
    { name: 'Garlic Rice', price: 4.25, category: 'Okra Green Rice Dishes', description: 'Garlic fried rice with fresh garlic', veg: true },
    { name: 'Lemon Rice', price: 4.25, category: 'Okra Green Rice Dishes', description: 'Lemon rice with citrus and spices', veg: true },
    
    // Sundries
    { name: 'Garlic Cheese Naan', price: 3.45, category: 'Sundries', description: 'Garlic and cheese naan bread', veg: true },
    { name: 'Garlic Chilli Cheese Naan', price: 3.45, category: 'Sundries', description: 'Garlic chilli cheese naan bread', veg: true },
    { name: 'Pizza Naan', price: 3.25, category: 'Sundries', description: 'Pizza style naan with cheese and toppings', veg: true },
    { name: 'Chicken Tikka Chilli Cheese Naan', price: 4.25, category: 'Sundries', description: 'Chicken tikka chilli cheese naan bread' },
    { name: 'Chicken Tikka Saag Chilli Naan', price: 4.25, category: 'Sundries', description: 'Chicken tikka saag chilli naan bread' },
    { name: 'Coconut Naan', price: 3.45, category: 'Sundries', description: 'Coconut naan bread with fresh coconut', veg: true },
    { name: 'Mango Chutney', price: 0.95, category: 'Sundries', description: 'Sweet mango chutney with spices', veg: true },
    { name: 'Onion Salad', price: 0.95, category: 'Sundries', description: 'Fresh onion salad with herbs', veg: true },
    { name: 'Mixed Pickle', price: 0.95, category: 'Sundries', description: 'Mixed pickle with assorted vegetables', veg: true },
    { name: 'Lime Pickle', price: 0.95, category: 'Sundries', description: 'Spicy lime pickle with chilli', veg: true },
    { name: 'Chips', price: 1.95, category: 'Sundries', description: 'Crispy potato chips', veg: true },
    { name: 'Poppadum', price: 0.95, category: 'Sundries', description: 'Crispy poppadum with spices', veg: true },
    { name: 'Lettuce Salad', price: 1.95, category: 'Sundries', description: 'Fresh lettuce salad with vegetables', veg: true },
    { name: 'Red Sauce', price: 0.95, category: 'Sundries', description: 'Spicy red sauce with chilli', veg: true },
    { name: 'Green Sauce', price: 0.95, category: 'Sundries', description: 'Green sauce with herbs and spices', veg: true },
    { name: 'Raita', price: 2.95, category: 'Sundries', description: 'Yogurt raita with cucumber and spices', veg: true },
    { name: 'Cucumber Raita', price: 2.95, category: 'Sundries', description: 'Cucumber raita with fresh cucumber', veg: true },
    { name: 'Tandoori Roti', price: 3.25, category: 'Sundries', description: 'Tandoori roti bread cooked in tandoor', veg: true },
    { name: 'Stuffed Paratha', price: 3.25, category: 'Sundries', description: 'Stuffed paratha with spiced filling', veg: true },
    { name: 'Puri', price: 1.95, category: 'Sundries', description: 'Puri bread deep fried to perfection', veg: true },
    { name: 'Chapatti', price: 2.25, category: 'Sundries', description: 'Chapatti bread cooked on tawa', veg: true },
    { name: 'Naan Bread', price: 2.95, category: 'Sundries', description: 'Plain naan bread cooked in tandoor', veg: true },
    { name: 'Peshwari Naan', price: 3.25, category: 'Sundries', description: 'Peshwari naan with nuts and raisins', veg: true },
    { name: 'Keema Naan', price: 3.45, category: 'Sundries', description: 'Keema naan with spiced minced meat' },
    { name: 'Garlic Naan', price: 3.25, category: 'Sundries', description: 'Garlic naan with fresh garlic', veg: true },
    { name: 'Chilli Naan', price: 3.25, category: 'Sundries', description: 'Chilli naan with green chillies', veg: true },
    { name: 'Cheese Naan', price: 3.25, category: 'Sundries', description: 'Cheese naan with melted cheese', veg: true },
    { name: 'Vegetable Naan', price: 3.25, category: 'Sundries', description: 'Vegetable naan with mixed vegetables', veg: true },
    
    // Okra Green Secret Dishes
    { name: 'Chicken Tikka Roll', price: 8.25, category: 'Okra Green Secret Dishes', description: 'Chicken tikka roll with spiced chicken' },
    { name: 'Lamb Kebab Roll', price: 8.25, category: 'Okra Green Secret Dishes', description: 'Lamb kebab roll with spiced lamb' },
    { name: 'Doner Meal', price: 10.95, category: 'Okra Green Secret Dishes', description: 'Doner kebab meal with salad and sauce' },
    { name: 'Tikka Meal', price: 10.95, category: 'Okra Green Secret Dishes', description: 'Chicken tikka meal with rice and salad' },
    { name: 'Butter Chicken Lasagne', price: 10.95, category: 'Okra Green Secret Dishes', description: 'Butter chicken lasagne with pasta sheets' },
    { name: 'XL OG Meal', price: 19.50, category: 'Okra Green Secret Dishes', description: 'XL Okra Green meal with multiple dishes' },
    
    // Okra Green Set Meals
    { name: 'Meal One', price: 16.95, category: 'Okra Green Set Meals', description: 'Starter: Chicken Tikka Main: Chicken Tikka Masala Side: Bombay Potato & Pilau Rice' },
    { name: 'Meal Two', price: 16.95, category: 'Okra Green Set Meals', description: 'Starter: Onion Bhaji Main: Chicken Korma Side: Saag Aloo & 1 Plain Naan' },
    
    // Drinks
    { name: 'Canned Drinks', price: 1.95, category: 'Drinks', description: 'Assorted canned drinks 330ml', veg: true },
    { name: 'Mineral Water 500ml', price: 1.95, category: 'Drinks', description: 'Mineral water 500ml', veg: true },
    { name: 'Bottled Drinks 1.5Ltr', price: 3.45, category: 'Drinks', description: 'Large bottled drinks 1.5Ltr', veg: true },
    
    // Desserts
    { name: 'Ice Cream', price: 4.95, category: 'Desserts', description: 'Vanilla ice cream with choice of toppings', veg: true },
    { name: 'Chocolate Fudge Cake', price: 4.95, category: 'Desserts', description: 'Rich chocolate fudge cake with chocolate sauce', veg: true },
    { name: 'Strawberry Cheesecake', price: 4.95, category: 'Desserts', description: 'Strawberry cheesecake with fresh strawberries', veg: true },
  ],
};

