import { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import Volume from '../Model/Book/Volume.js';
import db from '../Service/database.js';

import * as chai from 'chai'    
chai.use(chaiAsPromised)

const volume_name = "Volume cua Hai"
const volume_id = 1
const book_id = 1
const volume_number = 1

describe("Volume Class testing", () => {
    let queryStub;

    beforeEach(() => {
        // Giả lập phương thức query của db để không truy cập cơ sở dữ liệu thực
        queryStub = sinon.stub(db, "query");
    });

    afterEach(() => {
        // Khôi phục lại phương thức query sau mỗi test
        queryStub.restore();
    });

    it("should create volume", async () => {
        // Định nghĩa kết quả giả lập khi gọi query
        queryStub.resolves({ rows: [{ volume_name: volume_name, book_id: book_id, volume_number: volume_number }] });

        // Gọi hàm tạo Volume và đợi kết quả trả về
        const result = await Volume.create(volume_name, book_id);

        // Kiểm tra JSON trả về
        expect(result).to.have.property("volume_name", volume_name);
        expect(result).to.have.property("book_id");
        expect(result).to.have.property("volume_number");

        // Kiểm tra giá trị trả về
        expect(result.volume_name).to.equal(volume_name);
        expect(typeof result.book_id).to.equal("number")
        expect(typeof result.volume_number).to.equal("number")
        expect(result.book_id).to.not.be.undefined;
        expect(result.volume_number).to.not.be.undefined;

        // Kiểm tra xem db.query đã được gọi đúng cách
        expect(queryStub.calledOnce).to.be.true;
        expect(queryStub.firstCall.args[0]).to.include("INSERT INTO volumes");
    })

    it("should throw error if volume name already exists", async () => {
        // Mô phỏng lỗi "unique violation" từ PostgreSQL
        queryStub.rejects({ code: '23505' });

        // Kiểm tra xem lỗi có được ném ra đúng hay không
        await expect(Volume.create(volume_name, book_id))
            .to.be.rejectedWith("Volume name already exists for this book");

        // Kiểm tra xem phương thức query đã được gọi đúng cách chưa
        sinon.assert.calledOnceWithExactly(queryStub, sinon.match.string, [volume_name, book_id]);
    });

    it("should handle error in create", async () => {
        // Mock lỗi cơ sở dữ liệu
        queryStub.rejects(new Error("Database error"));

        try {
            await Volume.create(volume_name, book_id);
        } catch (err) {
            expect(err.message).to.equal("Database error");
        }
    });

    it("should find by name", async () => {
        // Định nghĩa kết quả giả lập khi gọi query
        queryStub.resolves({ rows: [{ volume_name: volume_name, book_id: book_id, volume_number: volume_number }] });

        // Gọi hàm tìm Volume và đợi kết quả trả về
        const result = await Volume.findByName(volume_name, book_id);

        // Kiểm tra JSON trả về
        expect(result).to.have.property("volume_name", volume_name);
        expect(result).to.have.property("book_id");
        expect(result).to.have.property("volume_number");

        // Kiểm tra giá trị trả về
        expect(result.volume_name).to.equal(volume_name);
        expect(typeof result.book_id).to.equal("number")
        expect(typeof result.volume_number).to.equal("number")
        expect(result.book_id).to.not.be.undefined;
        expect(result.volume_number).to.not.be.undefined;
    })

    it("should handle database error for find by name", async () => {
        // Mock lỗi cơ sở dữ liệu
        queryStub.rejects(new Error("Database error"));

        try {
            await Volume.findByName(volume_name, book_id);
        } catch (err) {
            expect(err.message).to.equal("Database error");
        }
    })

    it("should find by id", async () => {
        // Định nghĩa kết quả giả lập khi gọi query
        queryStub.resolves({ rows: [{ volume_name: volume_name, book_id: book_id, volume_number: volume_number }] });

        // Gọi hàm tìm Volume và đợi kết quả trả về
        const result = await Volume.findById(volume_name, book_id);

        // Kiểm tra JSON trả về
        expect(result).to.have.property("volume_name", volume_name);
        expect(result).to.have.property("book_id");
        expect(result).to.have.property("volume_number");

        // Kiểm tra giá trị trả về
        expect(result.volume_name).to.equal(volume_name);
        expect(typeof result.book_id).to.equal("number")
        expect(typeof result.volume_number).to.equal("number")
        expect(result.book_id).to.not.be.undefined;
        expect(result.volume_number).to.not.be.undefined;
    })

    it("should handle database error for find by id", async () => {
        // Mock lỗi cơ sở dữ liệu
        queryStub.rejects(new Error("Database error"));

        try {
            await Volume.findById(volume_name, book_id);
        } catch (err) {
            expect(err.message).to.equal("Database error");
        }
    })

    it("should find all volumes by book id", async () => {
        // Dữ liệu giả (mock data)
        const mockData = [
            { volume_name: "Volume 1", book_id: 1, volume_number: 1 },
            { volume_name: "Volume 2", book_id: 1, volume_number: 2 },
            { volume_name: "Volume 3", book_id: 1, volume_number: 3 }
        ];

        // Định nghĩa kết quả giả lập khi gọi query
        queryStub.resolves({ rows: mockData });

        // Gọi hàm kiểm tra findByBookId
        const result = await Volume.findByBookId(1);
        // Kiểm tra kết quả trả về
        expect(result).to.deep.equal(mockData);
        expect(queryStub.calledOnce).to.be.true;
    })

    it("should handle database error", async () => {
        // Mock lỗi cơ sở dữ liệu
        queryStub.rejects(new Error("Database error"));

        try {
            await Volume.findByBookId(1);
        } catch (err) {
            expect(err.message).to.equal("Database error");
        }
    })
})


// describe("Volume Class - init method", () => {
//         let queryStub;
//         let chapterStub;
//         let findByIdStub;
    
//         beforeEach(() => {
//             // Giả lập các phương thức truy vấn của db
//             queryStub = sinon.stub(db, "query");
//             chapterStub = sinon.stub(Chapter, "findByVolumeId");
//             findByIdStub = sinon.stub(Volume, "findById")
//         });
    
//         afterEach(() => {
//             // Khôi phục lại các phương thức sau mỗi test
//             queryStub.restore();
//             chapterStub.restore();
//             findByIdStub.restore()
//         });
    
//         it("should initialize volume and its chapters", async () => {
//             const mockVolume = {
//                 volume_id: volume_id,
//                 volume_name: volume_name,
//                 book_id: book_id,
//                 volume_number: volume_number,
//                 created_at: new Date(),
//             };
    
//             // Giả lập phương thức findById của Volume trả về volume
//             findByIdStub.resolves(mockVolume);
    
//             const mockChapters = [
//                 { chapter_id: 1, chapter_name: 'Chapter 1', chapter_number: 1, content: 'Content 1', volume_id: volume_id, book_id: book_id },
//                 { chapter_id: 2, chapter_name: 'Chapter 2', chapter_number: 2, content: 'Content 2', volume_id: volume_id, book_id: book_id },
//             ];
    
//             // Giả lập phương thức chapterStub của Chapter trả về các chapters
//             chapterStub.resolves(mockChapters);
    
//             const volume = new Volume();
//             await volume.init(volume_id);
    
//             // Kiểm tra các thuộc tính của volume
//             expect(volume.volume_id).to.equal(volume_id);
//             expect(volume.volume_name).to.equal(volume_name);
//             expect(volume.created_at).to.not.be.undefined;
//             expect(volume.chapters.length).to.equal(2); // Kiểm tra số lượng chapter
    
//             // Kiểm tra chapter 1
//             expect(volume.chapters[0].chapter_id).to.equal(mockChapters[0].chapter_id);
//             expect(volume.chapters[0].chapter_name).to.equal(mockChapters[0].chapter_name);
    
//             // Kiểm tra xem các phương thức findById và findByVolumeId đã được gọi đúng cách
//             expect(findByIdStub.calledOnceWith(volume_id)).to.be.true;
//             expect(chapterStub.calledOnceWith(volume_id)).to.be.true;
//         });
    
//         it("should throw error when volume not found", async () => {
//             const volumeID = 1;
    
//             // Mô phỏng kết quả trả về khi không tìm thấy volume
//             queryStub.resolves({ rows: [] });
    
//             const volume = new Volume();
    
//             // Kiểm tra xem khi không tìm thấy volume thì có ném lỗi đúng không
//             await expect(volume.init(volumeID)).to.be.rejectedWith("Volume not found");
    
//             // Kiểm tra gọi db.query đúng cách
//             expect(queryStub.calledOnce).to.be.true;
//             expect(chapterStub.notCalled).to.be.true; // Nếu không tìm thấy volume thì không gọi Chapter.findByVolumeId
//         });
//     });