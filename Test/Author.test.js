import { expect } from "chai";
import sinon from "sinon";  // Thư viện giả lập
import Author from "../Model/Person/Author.js";
import db from "../Service/database.js";  // Đảm bảo import db

const newAuthorName = "Hai";
const id = 1

describe("Author class testing", () => {
  let queryStub;

  beforeEach(() => {
    // Giả lập phương thức query của db để không truy cập cơ sở dữ liệu thực
    queryStub = sinon.stub(db, "query");
  });

  afterEach(() => {
    // Khôi phục lại phương thức query sau mỗi test
    queryStub.restore();
  });

  it("should create Author", async () => {
    // Định nghĩa kết quả giả lập khi gọi query
    queryStub.resolves({ rows: [{ author_id: 1, author_name: newAuthorName }] });

    // Gọi hàm tạo tác giả và đợi kết quả trả về
    const result = await Author.create(newAuthorName);

    // Kiểm tra JSON trả về
    expect(result).to.have.property("author_name", newAuthorName);
    expect(result).to.have.property("author_id");

    // Kiểm tra giá trị trả về
    expect(result.author_id).to.not.be.undefined;
    expect(result.author_name).to.equal(newAuthorName);
    expect(typeof result.author_id).to.equal("number");
   
    // Kiểm tra xem db.query đã được gọi đúng cách
    expect(queryStub.calledOnce).to.be.true;
    expect(queryStub.firstCall.args[0]).to.include("INSERT INTO authors");
  });


  it("should handle error in create Author", async () => {
    queryStub.rejects(new Error("Database error"));

    try {
      await Author.create(newAuthorName);
    } catch (err) {
      expect(err.message).to.equal("Database error");
    }
  });

  it("should find Author by id", async () => {
    // Mock trả về kết quả giả từ cơ sở dữ liệu
    queryStub.resolves({
      rows: [{ author_id: id, author_name: newAuthorName }],
    });

    const result = await Author.findById(id);

    // Kiểm tra JSON trả về
    expect(result).to.have.property("author_name");
    expect(result).to.have.property("author_id", id);

    // Kiểm tra giá trị trả về
    expect(result.author_id).to.not.be.undefined;
    expect(result.author_name).to.equal(newAuthorName);
    expect(typeof result.author_id).to.equal("number");
  });

  it("should handle error in findById", async () => {
    // Mock lỗi cơ sở dữ liệu
    queryStub.rejects(new Error("Database error"));

    try {
      await Author.findById(id);
    } catch (err) {
      expect(err.message).to.equal("Database error");
    }
  });

  it("should find Author by name", async () => {
    // Mock trả về kết quả giả từ cơ sở dữ liệu
    queryStub.resolves({
      rows: [{ author_id: id, author_name: newAuthorName }],
    });

    const result = await Author.findByName(newAuthorName);

    // Kiểm tra JSON trả về
    expect(result).to.have.property("author_name", newAuthorName);
    expect(result).to.have.property("author_id");

    // Kiểm tra giá trị trả về
    expect(result.author_id).to.not.be.undefined;
    expect(result.author_name).to.equal(newAuthorName);
    expect(typeof result.author_id).to.equal("number");
  })

  it("should handle error in findByName", async () => {
    // Mock lỗi cơ sở dữ liệu
    queryStub.rejects(new Error("Database error"));

    try {
      await Author.findByName(newAuthorName);
    } catch (err) {
      expect(err.message).to.equal("Database error");
    }
  });
});


describe('Author checkExist function', () => {
  let findByNameStub;
  let createAuthorStub;

  beforeEach(() => {
      findByNameStub = sinon.stub(Author, 'findByName');
      createAuthorStub = sinon.stub(Author, 'create');
  });

  afterEach(() => {
      sinon.restore();  // Khôi phục lại các phương thức đã giả lập
  });

  it('should return the author if the name exists', async () => {
      const name = 'John Doe';
      const existingAuthor = { name: 'John Doe', id: 1 };
      
      // Giả lập rằng Author.findByName sẽ trả về author đã tồn tại
      findByNameStub.withArgs(name).resolves(existingAuthor);

      const result = await Author.checkExist(name);

      expect(result).to.equal(existingAuthor);
      sinon.assert.calledOnceWithExactly(findByNameStub, name);
      sinon.assert.notCalled(createAuthorStub);
  });

  it('should create a new author if the name does not exist', async () => {
      const name = 'Jane Doe';
      const newAuthor = { name: 'Jane Doe', id: 2 };
      
      // Giả lập rằng Author.findByName sẽ không tìm thấy tên
      findByNameStub.withArgs(name).resolves(null);

      // Giả lập rằng Author.create sẽ tạo author mới
      createAuthorStub.withArgs(name).resolves(newAuthor);

      const result = await Author.checkExist(name);

      expect(result).to.equal(newAuthor);
      sinon.assert.calledOnceWithExactly(findByNameStub, name);
      sinon.assert.calledOnceWithExactly(createAuthorStub, name);
  });
});