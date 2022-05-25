const mailCtrl = require("../controllers/mailCtrl");
const router = require("express").Router();

/**
 * @swagger
 *  /api/mail/vcode/send:
 *    post:
 *      tags:
 *      - Mail
 *      description: email로 인증번호 전송
 *      parameters:
 *        - name: request
 *          in: body
 *          required: true
 *          schema:
 *            type: string
 *            example: {
 *              "email": "eric.kim@parksystems.com",
 *              "nation": "asia",
 *            }
 *      responses:
 *        '200':
 *          description: successful operation
 */

router.route("/vcode/send").post(mailCtrl.sendVcode);

/**
 * @swagger
 *  /api/mail/abstract:
 *    post:
 *      tags:
 *      - Mail
 *      description: email로 abstract 제출 alert 전송.
 *      parameters:
 *        - name: request
 *          in: body
 *          required: true
 *          schema:
 *            type: string
 *            example: {
 *              "email": "eric.kim@parksystems.com",
 *              "attachment": "첨부파일 URL",
 *              "title": "abstract 제목",
 *              "nation": "asia",
 *            }
 *      responses:
 *        '200':
 *          description: successful operation
 */
router.route("/abstract").post(mailCtrl.sendAbstractAlert);

module.exports = router;
