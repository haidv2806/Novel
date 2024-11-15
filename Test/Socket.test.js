import { expect } from "chai";
import sinon from "sinon";  // Thư viện giả lập
import Socket from "../Model/Socket/Socket.js";
import db from "../Service/database.js";  // Đảm bảo import db

const userId = 1
const roomId = 1
const content = "chat content"
const socketId = 1
const repliesId = 1
const page = 1


describe("Socket Class tessting", () => {
    let queryStub;

    beforeEach(() => {
        // Giả lập phương thức query của db để không truy cập cơ sở dữ liệu thực
        queryStub = sinon.stub(db, "query");
    });

    afterEach(() => {
        // Khôi phục lại phương thức query sau mỗi test
        queryStub.restore();
    });

    it("should add new chat", async () => {
        // Định nghĩa kết quả giả lập khi gọi query
        queryStub.resolves({ rows: [{ room_id: roomId, user_id: userId, content: content }] });

        // Gọi hàm tạo 1 socket mới và đợi kết quả trả về
        const result = await Socket.addNewChat(roomId, userId, content);

        // Kiểm tra JSON trả về
        expect(result).to.have.property("room_id", roomId);
        expect(result).to.have.property("user_id", userId);
        expect(result).to.have.property("content", content);

        // Kiểm tra giá trị trả về
        expect(result.content).to.equal(content);
        expect(result.room_id).to.not.be.undefined;
        expect(result.user_id).to.not.be.undefined;
        expect(typeof result.room_id).to.equal("number")
        expect(typeof result.user_id).to.equal("number")

        // Kiểm tra xem db.query đã được gọi đúng cách
        expect(queryStub.calledOnce).to.be.true;
        expect(queryStub.firstCall.args[0]).to.include("INSERT INTO socket");
    })

    it("should handle database error for addNewChat", async () => {
        // Mock lỗi cơ sở dữ liệu
        queryStub.rejects(new Error("Database error"));

        try {
            await Socket.addNewChat(roomId, userId, content);
        } catch (err) {
            expect(err.message).to.equal("Database error");
        }
    })

    it("should add new reply", async () => {
        // Định nghĩa kết quả giả lập khi gọi query
        queryStub.resolves({ rows: [{ socket_id: socketId, user_id: userId, content: content }] });

        // Gọi hàm tạo 1 reply mới và đợi kết quả trả về
        const result = await Socket.addNewReply(socketId, userId, content);

        // Kiểm tra JSON trả về
        expect(result).to.have.property("socket_id", socketId);
        expect(result).to.have.property("user_id", userId);
        expect(result).to.have.property("content", content);

        // Kiểm tra giá trị trả về
        expect(result.content).to.equal(content);
        expect(typeof result.socket_id).to.equal("number")
        expect(typeof result.user_id).to.equal("number")
        expect(result.socket_id).to.not.be.undefined;
        expect(result.user_id).to.not.be.undefined;

        // Kiểm tra xem db.query đã được gọi đúng cách
        expect(queryStub.calledOnce).to.be.true;
        expect(queryStub.firstCall.args[0]).to.include("INSERT INTO socket_replies");
    })

    it("should handle database error for addNewReply", async () => {
        // Mock lỗi cơ sở dữ liệu
        queryStub.rejects(new Error("Database error"));

        try {
            await Socket.addNewReply(socketId, userId, content);
        } catch (err) {
            expect(err.message).to.equal("Database error");
        }
    })

    it("should add like to a chat", async () => {
        // Định nghĩa kết quả giả lập khi gọi query
        queryStub.resolves({ rows: [{ socket_id: socketId, replies_id: repliesId, user_id: userId }] });

        // Gọi hàm tạo 1 like mới và đợi kết quả trả về
        const result = await Socket.addLike(socketId, repliesId, userId);

        // Kiểm tra JSON trả về
        expect(result).to.have.property("socket_id", socketId);
        expect(result).to.have.property("replies_id", repliesId);
        expect(result).to.have.property("user_id", userId);

        // Kiểm tra giá trị trả về
        expect(typeof result.socket_id).to.equal("number")
        expect(typeof result.replies_id).to.equal("number")
        expect(typeof result.user_id).to.equal("number")
        expect(result.socket_id).to.not.be.undefined;
        expect(result.replies_id).to.not.be.undefined;
        expect(result.user_id).to.not.be.undefined;

        // Kiểm tra xem db.query đã được gọi đúng cách
        expect(queryStub.calledOnce).to.be.true;
        expect(queryStub.firstCall.args[0]).to.include("INSERT INTO socket_likes");
    })

    it("should handle database error for addLike", async () => {
        // Mock lỗi cơ sở dữ liệu
        queryStub.rejects(new Error("Database error"));

        try {
            await Socket.addLike(socketId, repliesId, userId);
        } catch (err) {
            expect(err.message).to.equal("Database error");
        }
    })

    it("should get some chat in room", async () => {
        // Mock dữ liệu trả về
        const mockChats = [
            {
                socket_id: 1,
                room_id: roomId,
                user_id: 1,
                user_name: "John Doe",
                avatar: "avatar1.png",
                content: "Hello, world!",
                timestamp: new Date(),
            },
            {
                socket_id: 2,
                room_id: roomId,
                user_id: 2,
                user_name: "Jane Smith",
                avatar: "avatar2.png",
                content: "Hi there!",
                timestamp: new Date(),
            },
        ];

        // Định nghĩa kết quả giả lập khi gọi query
        queryStub.resolves({ rows: mockChats });

        // Gọi hàm getChatInRoom
        const result = await Socket.getChatInRoom(roomId, page);

        // Kiểm tra kết quả trả về
        expect(result).to.deep.equal(mockChats);

        // Kiểm tra query được gọi đúng
        expect(queryStub.calledOnce).to.be.true;
        expect(queryStub.firstCall.args[0]).to.include("SELECT socket_id, room_id");
        expect(queryStub.firstCall.args[1]).to.deep.equal([roomId, (page * 10) - 10]);
    })

    it("should handle database error for getChatInRoom", async () => {
        // Mock lỗi cơ sở dữ liệu
        queryStub.rejects(new Error("Database error"));

        try {
            await Socket.getChatInRoom(roomId, page);
        } catch (err) {
            expect(err.message).to.equal("Database error");
        }

        // Kiểm tra query được gọi đúng
        expect(queryStub.calledOnce).to.be.true;
        expect(queryStub.firstCall.args[1]).to.deep.equal([roomId, (page * 10) - 10]);
    })
})