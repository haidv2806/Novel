import db from "../../Service/database.js";

class Category {
    static async addCategories(bookid, categorie_name){
        const query = `
            INSERT INTO books_categories (book_id, category_id)
            VALUES ($1, $2)
        `
        try {
            const category_id = await Category.findByName(categorie_name)
            const result = await db.query(query, [bookid, category_id])

            return result.rows[0]
        } catch (err) {
            console.error('Error adding book categories:', err);
            throw err;
        }
    }

    static async findByName(name){
        const query = `
            SELECT category_id
            FROM categories
            WHERE LOWER(category_name) = LOWER($1)
        `
        try {
            const result = await db.query(query, [name])
            if (result.rows[0]) {
                return result.rows[0].category_id
            } else {
                throw new Error (`Không tìm thấy kết quả nào của ${name}`)
            }
        } catch (err) {
            console.error('Error finding category_id:', err);
            throw err;
        }
    }

    static async findAllCategoriessByBookName(book_name){
        const query =`
            SELECT categories.category_name
            FROM books_categories
                INNER JOIN categories ON categories.category_id = books_categories.category_id
                INNER JOIN books ON books_categories.book_id = books.book_id
            WHERE LOWER(book_name) = LOWER($1)
        `
        try {
            const result = await db.query(query, [book_name])
            if (result.rows[0]) {
                console.log(result.rows);
                return result.rows
            } else {
                throw new Error ("Không tìm thấy kết quả nào")
            }
        } catch (err) {
            console.error('Error finding category by book name:', err);
            throw err;
        }
    }
}

export default Category