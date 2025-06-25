import OAuth from 'oauth-1.0a';
import crypto from 'crypto';

export class LTIProvider {
  private readonly consumerKey: string;
  private readonly consumerSecret: string;

  constructor(consumerKey: string, consumerSecret: string) {
    this.consumerKey = consumerKey;
    this.consumerSecret = consumerSecret;
  }

//   private createOAuth() {
//     return new OAuth({
//       consumer: {
//         key: this.consumerKey,
//         secret: this.consumerSecret,
//       },
//       signature_method: 'HMAC-SHA1',
//       hash_function(baseString: string, key: string) {
//         return crypto
//           .createHmac('sha1', key)
//           .update(baseString)
//           .digest('base64');
//       },
//     });
//   }

  async sendScore(params: {
    sourcedId: string;
    outcomeUrl: string;
    score: number;
  }) {
    const { sourcedId, outcomeUrl, score } = params;
    
    if (score < 0 || score > 1) {
      throw new Error('Score must be between 0 and 1');
    }

   // const oauth = this.createOAuth();
    const requestData = {
      url: outcomeUrl,
      method: 'POST',
    };

   // const headers = oauth.toHeader(oauth.authorize(requestData));

    const body = `
      <?xml version="1.0" encoding="UTF-8"?>
      <imsx_POXEnvelopeRequest xmlns="http://www.imsglobal.org/services/ltiv1p1/xsd/imsoms_v1p0">
        <imsx_POXHeader>
          <imsx_POXRequestHeaderInfo>
            <imsx_version>V1.0</imsx_version>
            <imsx_messageIdentifier>${Date.now()}</imsx_messageIdentifier>
          </imsx_POXRequestHeaderInfo>
        </imsx_POXHeader>
        <imsx_POXBody>
          <replaceResultRequest>
            <resultRecord>
              <sourcedGUID>
                <sourcedId>${sourcedId}</sourcedId>
              </sourcedGUID>
              <result>
                <resultScore>
                  <language>en</language>
                  <textString>${score}</textString>
                </resultScore>
              </result>
            </resultRecord>
          </replaceResultRequest>
        </imsx_POXBody>
      </imsx_POXEnvelopeRequest>
    `.trim();

    const response = await fetch(outcomeUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/xml',
        //...headers,
      },
      body,
    });

    if (!response.ok) {
      throw new Error(`Failed to send score: ${response.statusText}`);
    }

    return response;
  }
}
