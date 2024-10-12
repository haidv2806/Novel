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

    static async findAllCategoriessByBookId(book_id){
        const query =`
            SELECT category_name
            FROM categories
                INNER JOIN books_categories ON categories.category_id = books_categories.category_id
            WHERE book_id = $1
        `
        try {
            const result = await db.query(query, [book_id])
            if (result.rows[0]) {
                let BookGenre = []
                result.rows.forEach(genre => {
                    BookGenre.push(genre.category_name)
                });
                
                return BookGenre
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