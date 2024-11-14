// import pactum from "pactum";

// const Email = "Haidv2806@gmail.com";
// const Password = "Haidv2806";
// const UserId = 3;
// const UserName = "haidep trai";

// describe('Auth API', () => {
//     it('POST /Auth/sign_in - should sign in successfully', async () => {
//         await pactum.spec()
//             .post('http://localhost:3000/Auth/sign_in')
//             .withJson({
//                 email: Email,
//                 password: Password
//             })
//             .expectStatus(200)  // Kiểm tra mã trạng thái HTTP
            
//             // .expectJsonMatch({
//             //     result: true,
//             //     message: 'đã xác thực',
//             //     token: {
//             //         refreshToken: /^[\w-]+\.[\w-]+\.[\w-]+$/,  // Kiểm tra token có định dạng JWT
//             //         accessToken: /^[\w-]+\.[\w-]+\.[\w-]+$/
//             //     },
//             //     user: {
//             //         user_id: UserId,
//             //         email: Email,
//             //         user_name: UserName,
//             //         avatar: /^(http|https):\/\/.+$/  // Kiểm tra URL của avatar
//             //     }
//             // })
//             // .expectJsonLike({
//             //     token: {
//             //         refreshToken: String,  // Kiểm tra kiểu chuỗi cho refreshToken
//             //         accessToken: String   // Kiểm tra kiểu chuỗi cho accessToken
//             //     },
//             //     user: {
//             //         user_id: UserId,
//             //         email: Email
//             //     }
//             // });
//     });
// });