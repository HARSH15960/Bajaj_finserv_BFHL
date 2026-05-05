const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const USER_DETAILS = {
  full_name: "harsh_singla",   
  dob: "08072005",             
  email: "harsh0765.be23@chitkara.edu.in",
  roll_number: "2310990765",
};

const USER_ID = `${USER_DETAILS.full_name}_${USER_DETAILS.dob}`;

/**
 * Classify a single token from the input array.
 * A token can be a single char OR a multi-char string (e.g. "ABcD").
 *
 * Rules inferred from the problem:
 *   - Pure number string  → number (even/odd based on numeric value)
 *   - Pure alpha string   → alphabet (each char uppercased, returned as one item)
 *   - Mixed / special     → treated char-by-char? No — problem returns whole token as alphabet
 *                           if ALL chars are alphabetic (e.g. "ABcD" → "ABCD").
 *                           Otherwise each individual char is categorised.
 */
function categorise(token) {
  const result = {
    numbers: [],
    alphabets: [],
    special_characters: [],
  };

  if (/^\d+$/.test(token)) {
    result.numbers.push(token);
    return result;
  }

  if (/^[a-zA-Z]+$/.test(token)) {
    result.alphabets.push(token.toUpperCase());
    return result;
  }

  for (const ch of token) {
    if (/\d/.test(ch)) {
      result.numbers.push(ch);
    } else if (/[a-zA-Z]/.test(ch)) {
      result.alphabets.push(ch.toUpperCase());
    } else {
      result.special_characters.push(ch);
    }
  }
  return result;
}

/**
 * Build concat_string:
 *   - Take all alphabetical CHARACTERS from alphabets array (flattened)
 *   - Reverse their order
 *   - Apply alternating caps starting from index 0 → uppercase, 1 → lowercase …
 */
function buildConcatString(alphabets) {
  
  const chars = alphabets.flatMap((s) => s.split(""));
  const reversed = chars.reverse();
  return reversed
    .map((ch, i) => (i % 2 === 0 ? ch.toUpperCase() : ch.toLowerCase()))
    .join("");
}

app.post("/bfhl", (req, res) => {
  try {
    const { data } = req.body;

    if (!data || !Array.isArray(data)) {
      return res.status(400).json({
        is_success: false,
        user_id: USER_ID,
        email: USER_DETAILS.email,
        roll_number: USER_DETAILS.roll_number,
        error: "Invalid input. 'data' must be a non-empty array.",
      });
    }

    const allNumbers = [];
    const allAlphabets = [];
    const allSpecial = [];

    for (const token of data) {
      const tokenStr = String(token);
      const { numbers, alphabets, special_characters } = categorise(tokenStr);
      allNumbers.push(...numbers);
      allAlphabets.push(...alphabets);
      allSpecial.push(...special_characters);
    }

    const evenNumbers = allNumbers.filter((n) => parseInt(n, 10) % 2 === 0);
    const oddNumbers = allNumbers.filter((n) => parseInt(n, 10) % 2 !== 0);

    const sum = String(allNumbers.reduce((acc, n) => acc + parseInt(n, 10), 0));

    const concatString = buildConcatString(allAlphabets);

    return res.status(200).json({
      is_success: true,
      user_id: USER_ID,
      email: USER_DETAILS.email,
      roll_number: USER_DETAILS.roll_number,
      odd_numbers: oddNumbers,
      even_numbers: evenNumbers,
      alphabets: allAlphabets,
      special_characters: allSpecial,
      sum,
      concat_string: concatString,
    });
  } catch (err) {
    console.error("BFHL Error:", err);
    return res.status(500).json({
      is_success: false,
      user_id: USER_ID,
      email: USER_DETAILS.email,
      roll_number: USER_DETAILS.roll_number,
      error: "Internal server error.",
    });
  }
});

app.get("/bfhl", (req, res) => {
  res.status(200).json({ operation_code: 1 });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`BFHL server running on port ${PORT}`));