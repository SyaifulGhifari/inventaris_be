import { db } from '../src/config/database';
import { users, products } from '../src/db/schema';
import { authService } from '../src/services/auth.service';
import { logger } from '../src/config/logger';

/**
 * Seed script to populate database with initial data
 * Run with: npm run db:seed
 */
async function seed() {
    try {
        logger.info('Starting database seed...');

        // Create admin user
        logger.info('Creating admin user...');
        const hashedPassword = await authService.hashPassword('admin123');

        const [adminUser] = await db
            .insert(users)
            .values({
                email: 'admin@gudang.com',
                password: hashedPassword,
                name: 'Admin User',
                role: 'admin',
            })
            .returning();

        logger.info(`Admin user created: ${adminUser.email}`);

        // Create staff user
        const staffPassword = await authService.hashPassword('staff123');
        const [staffUser] = await db
            .insert(users)
            .values({
                email: 'staff@gudang.com',
                password: staffPassword,
                name: 'Staff User',
                role: 'staff',
            })
            .returning();

        logger.info(`Staff user created: ${staffUser.email}`);

        // Create sample products
        logger.info('Creating sample products...');

        const sampleProducts = [
            {
                name: 'Celana Jeans Slim Fit',
                category: 'Celana Jeans',
                sizes: ['S', 'M', 'L', 'XL'],
                color: 'Dark Blue',
                material: 'Denim',
                stock: 50,
                price: '250000',
                description: 'Celana jeans slim fit dengan bahan denim premium',
                imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d',
                createdBy: adminUser.id,
                updatedBy: adminUser.id,
            },
            {
                name: 'Celana Chino Casual',
                category: 'Celana',
                sizes: ['M', 'L', 'XL', 'XXL'],
                color: 'Khaki',
                material: 'Cotton',
                stock: 35,
                price: '180000',
                description: 'Celana chino casual untuk penggunaan sehari-hari',
                imageUrl: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a',
                createdBy: adminUser.id,
                updatedBy: adminUser.id,
            },
            {
                name: 'Baju Kemeja Formal',
                category: 'Baju',
                sizes: ['S', 'M', 'L', 'XL'],
                color: 'White',
                material: 'Cotton',
                stock: 60,
                price: '150000',
                description: 'Kemeja formal untuk acara resmi',
                imageUrl: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf',
                createdBy: adminUser.id,
                updatedBy: adminUser.id,
            },
            {
                name: 'Baju Kaos Polos',
                category: 'Baju',
                sizes: ['S', 'M', 'L', 'XL', 'XXL'],
                color: 'Black',
                material: 'Cotton',
                stock: 100,
                price: '75000',
                description: 'Kaos polos berkualitas tinggi',
                imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab',
                createdBy: adminUser.id,
                updatedBy: adminUser.id,
            },
            {
                name: 'Jaket Bomber',
                category: 'Jaket',
                sizes: ['M', 'L', 'XL'],
                color: 'Navy',
                material: 'Polyester',
                stock: 25,
                price: '350000',
                description: 'Jaket bomber stylish untuk musim hujan',
                imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5',
                createdBy: adminUser.id,
                updatedBy: adminUser.id,
            },
            {
                name: 'Jaket Denim',
                category: 'Jaket',
                sizes: ['S', 'M', 'L', 'XL'],
                color: 'Light Blue',
                material: 'Denim',
                stock: 30,
                price: '300000',
                description: 'Jaket denim klasik yang tidak pernah ketinggalan zaman',
                imageUrl: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0',
                createdBy: adminUser.id,
                updatedBy: adminUser.id,
            },
            {
                name: 'Celana Jeans Skinny',
                category: 'Celana Jeans',
                sizes: ['S', 'M', 'L'],
                color: 'Black',
                material: 'Denim Stretch',
                stock: 8, // Low stock
                price: '275000',
                description: 'Celana jeans skinny dengan bahan stretch',
                imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246',
                createdBy: adminUser.id,
                updatedBy: adminUser.id,
            },
            {
                name: 'Baju Polo Shirt',
                category: 'Baju',
                sizes: ['M', 'L', 'XL'],
                color: 'Red',
                material: 'Cotton Pique',
                stock: 5, // Low stock
                price: '120000',
                description: 'Polo shirt casual untuk berbagai acara',
                imageUrl: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d',
                createdBy: adminUser.id,
                updatedBy: adminUser.id,
            },
        ];

        await db.insert(products).values(sampleProducts);

        logger.info(`Created ${sampleProducts.length} sample products`);
        logger.info('Database seed completed successfully!');
        logger.info('\nDefault credentials:');
        logger.info('Admin - Email: admin@gudang.com, Password: admin123');
        logger.info('Staff - Email: staff@gudang.com, Password: staff123');

        process.exit(0);
    } catch (error) {
        logger.error('Seed failed:', error);
        process.exit(1);
    }
}

// Run seed
seed();
