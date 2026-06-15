const ActivationCode =
  require(
    "../models/ActivationCode"
  );

exports.generateCodes =
async (req, res) => {

  try {

    const { amount } =
      req.body;

    let codes = [];

    for (
      let i = 0;
      i < amount;
      i++
    ) {

      let created = false;

      while (!created) {

        try {

          const randomCode =

            "AFF-" +

            Math.floor(

              100000 +

              Math.random() * 900000

            );

          const newCode =
            await ActivationCode.create({

              code: randomCode

            });

          codes.push(
            newCode
          );

          created = true;

        } catch (error) {

          // DUPLICATE CODE

          if (
            error.code === 11000
          ) {

            console.log(
              "Duplicate code, retrying..."
            );

          } else {

            throw error;

          }

        }

      }

    }

    res.json({

      message:
        `${amount} activation codes generated successfully`,

      codes

    });

  } catch (error) {

    res.status(500).json({

      message:
        error.message

    });

  }

};