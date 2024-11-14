import { expect } from "chai";
import sinon from "sinon";  // Thư viện giả lập
import Artist from "../Model/Person/Artist.js";
import db from "../Service/database.js";  // Đảm bảo import db

const newArtistName = "anhhai";
const id = 1

describe("Artist class testing", () => {
    let queryStub;

    beforeEach(() => {
        // Giả lập phương thức query của db để không truy cập cơ sở dữ liệu thực
        queryStub = sinon.stub(db, "query");
    });

    afterEach(() => {
        // Khôi phục lại phương thức query sau mỗi test
        queryStub.restore();
    });

    it("should create Artist", async () => {
        // Định nghĩa kết quả giả lập khi gọi query
        queryStub.resolves({ rows: [{ artist_id: 1, artist_name: newArtistName }] });

        // Gọi hàm tạo tác giả và đợi kết quả trả về
        const result = await Artist.create(newArtistName);

        // Kiểm tra JSON trả về
        expect(result).to.have.property("artist_name", newArtistName);
        expect(result).to.have.property("artist_id");

        // Kiểm tra giá trị trả về
        expect(result.artist_id).to.not.be.undefined;
        expect(result.artist_name).to.equal(newArtistName);
        expect(typeof result.artist_id).to.equal("number");

        // Kiểm tra xem db.query đã được gọi đúng cách
        expect(queryStub.calledOnce).to.be.true;
        expect(queryStub.firstCall.args[0]).to.include("INSERT INTO artist");
    });


    it("should handle error in create Artist", async () => {
        queryStub.rejects(new Error("Database error"));

        try {
            await Artist.create(newArtistName);
        } catch (err) {
            expect(err.message).to.equal("Database error");
        }
    });

    it("should find Artist by id", async () => {
        // Mock trả về kết quả giả từ cơ sở dữ liệu
        queryStub.resolves({
            rows: [{ artist_id: id, artist_name: newArtistName }],
        });

        const result = await Artist.findById(id);

        // Kiểm tra JSON trả về
        expect(result).to.have.property("artist_name");
        expect(result).to.have.property("artist_id", id);

        // Kiểm tra giá trị trả về
        expect(result.artist_id).to.not.be.undefined;
        expect(result.artist_name).to.equal(newArtistName);
        expect(typeof result.artist_id).to.equal("number");
    });

    it("should handle error in findById", async () => {
        // Mock lỗi cơ sở dữ liệu
        queryStub.rejects(new Error("Database error"));

        try {
            await Artist.findById(id);
        } catch (err) {
            expect(err.message).to.equal("Database error");
        }
    });

    it("should find Aritst by name", async () => {
        // Mock trả về kết quả giả từ cơ sở dữ liệu
        queryStub.resolves({
            rows: [{ artist_id: id, artist_name: newArtistName }],
        });

        const result = await Artist.findByName(newArtistName);

        // Kiểm tra JSON trả về
        expect(result).to.have.property("artist_name", newArtistName);
        expect(result).to.have.property("artist_id");

        // Kiểm tra giá trị trả về
        expect(result.artist_id).to.not.be.undefined;
        expect(result.artist_name).to.equal(newArtistName);
        expect(typeof result.artist_id).to.equal("number");
    })

    it("should handle error in findByName", async () => {
        // Mock lỗi cơ sở dữ liệu
        queryStub.rejects(new Error("Database error"));

        try {
            await Artist.findByName(newArtistName);
        } catch (err) {
            expect(err.message).to.equal("Database error");
        }
    });
});


describe('Artist checkExist function', () => {
    let findByNameStub;
    let createArtistStub;

    beforeEach(() => {
        findByNameStub = sinon.stub(Artist, 'findByName');
        createArtistStub = sinon.stub(Artist, 'create');
    });

    afterEach(() => {
        sinon.restore();  // Khôi phục lại các phương thức đã giả lập
    });

    it('should return the artist if the name exists', async () => {
        const name = 'John Doe';
        const existingArtist = { name: 'John Doe', id: 1 };

        // Giả lập rằng Artist.findByName sẽ trả về artist đã tồn tại
        findByNameStub.withArgs(name).resolves(existingArtist);

        const result = await Artist.checkExist(name);

        expect(result).to.equal(existingArtist);
        sinon.assert.calledOnceWithExactly(findByNameStub, name);
        sinon.assert.notCalled(createArtistStub);
    });

    it('should create a new artist if the name does not exist', async () => {
        const name = 'Jane Doe';
        const newArtist = { name: 'Jane Doe', id: 2 };

        // Giả lập rằng Artist.findByName sẽ không tìm thấy tên
        findByNameStub.withArgs(name).resolves(null);

        // Giả lập rằng Artist.create sẽ tạo aritst mới
        createArtistStub.withArgs(name).resolves(newArtist);

        const result = await Artist.checkExist(name);

        expect(result).to.equal(newArtist);
        sinon.assert.calledOnceWithExactly(findByNameStub, name);
        sinon.assert.calledOnceWithExactly(createArtistStub, name);
    });
});