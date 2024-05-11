INSERT INTO carts (id, user_id, created_at, updated_at, status)
VALUES 
(gen_random_uuid(), gen_random_uuid(), CURRENT_DATE, CURRENT_DATE, 'OPEN'),
(gen_random_uuid(), gen_random_uuid(), CURRENT_DATE, CURRENT_DATE, 'ORDERED');


INSERT INTO cart_items (cart_id, product_id, count)
VALUES 
('249f0c45-9330-43c0-bc81-bf43facf78a1', gen_random_uuid(), 3),
('249f0c45-9330-43c0-bc81-bf43facf78a1', gen_random_uuid(), 2),
('249f0c45-9330-43c0-bc81-bf43facf78a1', gen_random_uuid(), 1);
