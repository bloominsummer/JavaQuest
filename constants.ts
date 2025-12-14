import { Lesson } from './types';

export const JAVA_COURSE: Lesson[] = [
  {
    id: 'java-datatypes-0',
    title: 'Tipe Data & Identifier',
    description: 'Pondasi dasar: Primitive vs Non-Primitive.',
    xpReward: 150,
    questions: [
      {
        id: 'sim-dt-1',
        type: 'simulation',
        text: `**Memahami Tipe Data**\n\nDi Java, kita harus memberi tahu komputer jenis data apa yang sedang kita simpan. Berikut adalah peta tipe data di Java:`,
        customContent: {
          type: 'dataTypeCards',
          data: [
            {
              title: "Primitive Types (Sederhana)",
              color: 'cyan',
              items: [
                { label: 'int', desc: 'Angka bulat (contoh: 10, -5, 100)' },
                { label: 'double', desc: 'Angka desimal (contoh: 3.14, 0.5)' },
                { label: 'boolean', desc: 'Logika (true atau false)' },
                { label: 'char', desc: "Satu karakter (contoh: 'A', '1')" }
              ]
            },
            {
              title: "Non-Primitive (Kompleks)",
              color: 'fuchsia',
              items: [
                { label: 'String', desc: 'Teks/Kalimat (contoh: "Halo Java")' },
                { label: 'Array', desc: 'Daftar data (contoh: [1, 2, 3])' }
              ]
            }
          ]
        },
        codeSnippet: '', 
        simulationConfig: {
          runButtonLabel: "Compile & Run",
          defaultCode: `public class Main {
  public static void main(String[] args) {
    // BUG: "90" dianggap Teks (String), bukan Angka (int)
    // TUGAS: Hapus tanda kutip agar menjadi angka.
    int nilai = "90";
    
    System.out.println(nilai);
  }
}`,
          validation: {
            correctRegex: 'int\\s+nilai\\s*=\\s*\\d+\\s*;',
            successMessage: "✅ SUCCESS: Code Compiled! Output: 90",
            errorMessage: "❌ SYNTAX ERROR: Kode tidak valid. Cek penulisanmu.",
            errorMatchers: [
              {
                regex: 'int\\s+nilai\\s*=\\s*"\\d+"\\s*;',
                message: "❌ ERROR: Incompatible Types. String cannot be converted to int."
              }
            ]
          }
        },
        explanation: "Kerja bagus! Di Java, angka (int) tidak boleh menggunakan tanda kutip. Tanda kutip hanya untuk String (Teks).",
        options: [],
        correctAnswerIndex: 0
      },
      {
        id: 'ident-2',
        type: 'checklist',
        text: `**Identifier (Nama Variabel)**\n\nIdentifier adalah nama yang kita berikan untuk variabel, method, atau class. Agar kode mudah dibaca dan tidak error, ada aturannya!\n\n**Rules (Wajib):**\n- **Case Sensitive**: \`nama\` beda dengan \`Nama\`.\n- **Allowed**: Huruf, Angka, \`$\`, \`_\`.\n- **Forbidden**: Diawali angka, spasi, operator, keyword Java.\n\n**Naming Styles:**\n- **camelCase**: \`namaSiswa\` (standard variabel)\n- **PascalCase**: \`NamaKelas\` (standard Class)\n- **UPPER_CASE**: \`MAX_LIMIT\` (standard Konstanta)`,
        codeSnippet: `String namaSiswa;
int umur;
boolean isActive;`,
        checklistItems: [
          "Tidak boleh diawali angka",
          "Tidak boleh mengandung spasi",
          "Tidak boleh keyword Java",
          "Gunakan camelCase"
        ],
        explanation: "Sempurna! Kamu siap untuk menulis variabel yang bersih dan valid.",
        xpReward: 50
      },
      {
        id: 'sim-ident-3',
        type: 'simulation',
        text: `**Mission: Buat Identifier Sendiri**\n\nSekarang giliranmu! Kita butuh variabel untuk menyimpan **skor pemain**.\n\n**Instruksi:**\n1. Buat variabel tipe \`int\`.\n2. Beri nama **playerScore** (gunakan aturan camelCase!).\n3. Isi dengan nilai **100**.\n4. Jangan lupa titik koma \`;\` di akhir.`,
        codeSnippet: '',
        simulationConfig: {
          runButtonLabel: "Compile Code",
          defaultCode: `public class Main {
  public static void main(String[] args) {
    // Tulis kodemu di baris 4:
    
  }
}`,
          validation: {
            correctRegex: 'int\\s+playerScore\\s*=\\s*100\\s*;',
            successMessage: "✅ SUCCESS: Identifier Valid! System Updated.",
            errorMessage: "❌ SYNTAX ERROR: Cek format 'int namaVariabel = nilai;'",
            errorMatchers: [
              {
                regex: 'int\\s+PlayerScore',
                message: "⚠️ Warning: Gunakan camelCase. Huruf pertama harus kecil ('playerScore'), bukan kapital."
              },
              {
                regex: 'int\\s+player\\s+score',
                message: "⚠️ Error: Identifier tidak boleh mengandung SPASI."
              },
              {
                regex: 'int\\s+player_score',
                message: "⚠️ Style Guide: Di Java, gunakan camelCase (playerScore), bukan snake_case."
              },
              {
                regex: 'playerScore\\s*=\\s*100',
                message: "⚠️ Error: Kamu lupa menulis tipe data 'int' di depan."
              },
              {
                regex: 'int\\s+playerscore',
                message: "⚠️ Readability: Gunakan huruf besar untuk kata kedua (camelCase) -> 'playerScore'."
              }
            ]
          }
        },
        explanation: "Hebat! Kamu telah membuat identifier yang valid dan mengikuti konvensi camelCase Java.",
        xpReward: 100
      },
      {
        id: 'err-common-4',
        type: 'interactive_cards',
        text: `**⚠️ SYSTEM ALERT: Common Errors Detected**\n\nBanyak programmer pemula sering terjebak dalam error berikut. Klik setiap kartu peringatan untuk menganalisis kesalahan dan melihat solusinya.`,
        interactiveCards: [
          {
            id: 'err-1',
            title: 'Salah Tipe Data',
            badCode: 'int gaji = "5000";',
            goodCode: 'int gaji = 5000;',
            explanation: 'Jangan gunakan tanda kutip untuk Angka. Java akan menganggapnya sebagai String (Teks), padahal variabelnya bertipe int.'
          },
          {
            id: 'err-2',
            title: 'Identifier Ilegal',
            badCode: 'int 1stJuara = 100;',
            goodCode: 'int juara1 = 100;',
            explanation: 'Variabel TIDAK BOLEH diawali dengan angka. Pindahkan angka ke belakang atau tengah.'
          },
          {
            id: 'err-3',
            title: 'Case Sensitive',
            badCode: 'int skor = 10;\nSystem.out.println(Skor);',
            goodCode: 'int skor = 10;\nSystem.out.println(skor);',
            explanation: 'Java membedakan huruf besar dan kecil. "skor" dan "Skor" dianggap dua hal yang berbeda.'
          },
          {
            id: 'err-4',
            title: 'Salah Tanda Petik',
            badCode: 'char grade = "A";',
            goodCode: "char grade = 'A';",
            explanation: 'Untuk tipe data char (satu karakter), wajib gunakan kutip satu (\'). Kutip dua (") hanya untuk String.'
          }
        ],
        explanation: "Analisis selesai! Menghindari error dasar ini akan mempercepat proses codingmu secara signifikan.",
        xpReward: 75
      }
    ]
  },
  {
    id: 'java-game-tf-1',
    title: 'Game 1: Logic Gate',
    description: 'Tentukan pernyataan benar atau salah.',
    xpReward: 300,
    questions: [
      {
        id: 'tf-game-q1',
        type: 'true_false_game',
        text: 'Decipher the Code Matrix. Determine if the statements are TRUE or FALSE.',
        trueFalseGameConfig: {
          minScoreToPass: 3,
          successMessage: "ACCESS GRANTED. Knowledge Verified. Sort Game Unlocked.",
          failMessage: "ACCESS DENIED. Too many errors. Please retry the protocol.",
          statements: [
            {
              id: 'st-1',
              text: 'int dapat menyimpan nilai "90"',
              isCorrect: false,
              explanation: 'Salah! "90" adalah String. int menyimpan angka tanpa kutip (90).'
            },
            {
              id: 'st-2',
              text: 'String adalah tipe data non-primitif',
              isCorrect: true,
              explanation: 'Benar! String adalah object (Class), bukan tipe data dasar.'
            },
            {
              id: 'st-3',
              text: 'Identifier boleh diawali dengan angka',
              isCorrect: false,
              explanation: 'Salah! Identifier (nama variabel) TIDAK boleh dimulai dengan angka.'
            },
            {
              id: 'st-4',
              text: 'boolean hanya memiliki dua nilai (true/false)',
              isCorrect: true,
              explanation: 'Benar! Tipe boolean hanya bisa bernilai true atau false.'
            },
            {
              id: 'st-5',
              text: 'char menggunakan tanda kutip dua (")',
              isCorrect: false,
              explanation: 'Salah! char menggunakan kutip satu (\'). Kutip dua untuk String.'
            }
          ]
        },
        explanation: "Protocol complete. Proceed to the Data Sorter.",
        xpReward: 0 
      }
    ]
  },
  {
    id: 'java-game-sort-2',
    title: 'Game 2: Data Sorter',
    description: 'Kelompokkan data ke memori yang sesuai.',
    xpReward: 500,
    questions: [
      {
        id: 'drag-game-q1',
        type: 'drag_drop_game',
        text: 'Incoming Data Stream Detected. Sort values to prevent system overflow.',
        dragDropConfig: {
          successMessage: "ALL SYSTEMS OPERATIONAL. Data sorted successfully.",
          items: [
            { id: 'item-1', content: '"Andi"', type: 'String' },
            { id: 'item-2', content: '17', type: 'int' },
            { id: 'item-3', content: 'true', type: 'boolean' },
            { id: 'item-4', content: "'A'", type: 'char' },
            { id: 'item-5', content: '"Java"', type: 'String' },
            { id: 'item-6', content: '100', type: 'int' },
            { id: 'item-7', content: 'false', type: 'boolean' },
            { id: 'item-8', content: "'Z'", type: 'char' }
          ],
          zones: [
            { id: 'zone-1', type: 'int', label: 'int' },
            { id: 'zone-2', type: 'String', label: 'String' },
            { id: 'zone-3', type: 'boolean', label: 'boolean' },
            { id: 'zone-4', type: 'char', label: 'char' }
          ]
        },
        explanation: "Excellent sorting! You now understand which values belong to which data types.",
        xpReward: 0
      }
    ]
  },
  {
    id: 'java-game-ident-3',
    title: 'Game 3: Syntax Guardian',
    description: 'Validasi penulisan identifier Java.',
    xpReward: 400,
    questions: [
      {
        id: 'ident-game-q1',
        type: 'identifier_validation_game',
        text: 'SCANNING FOR MALFORMED IDENTIFIERS...',
        identifierGameConfig: {
          minScoreToPass: 4,
          successMessage: "SYSTEM SECURED. No syntax threats detected.",
          failMessage: "SECURITY BREACH. Malformed identifiers found. Retrying...",
          items: [
            {
              id: 'id-1',
              text: 'namaSiswa',
              isValid: true,
              explanation: 'Valid! Uses camelCase and contains only letters.'
            },
            {
              id: 'id-2',
              text: '1umur',
              isValid: false,
              explanation: 'Invalid! Identifiers cannot start with a number.'
            },
            {
              id: 'id-3',
              text: 'umur siswa',
              isValid: false,
              explanation: 'Invalid! Identifiers cannot contain spaces.'
            },
            {
              id: 'id-4',
              text: 'isActive',
              isValid: true,
              explanation: 'Valid! Perfect for boolean variables.'
            },
            {
              id: 'id-5',
              text: 'public',
              isValid: false,
              explanation: 'Invalid! "public" is a reserved Java keyword.'
            },
            {
              id: 'id-6',
              text: 'MAX_SCORE',
              isValid: true,
              explanation: 'Valid! Uppercase with underscores is standard for constants.'
            }
          ]
        },
        explanation: "Validation complete. You now have a sharp eye for legal Java identifiers.",
        xpReward: 0
      }
    ]
  },
  {
    id: 'java-game-var-4',
    title: 'Game 4: Variable Simulator',
    description: 'Pahami cara variabel menyimpan data.',
    xpReward: 400,
    questions: [
      {
        id: 'var-sim-q1',
        type: 'variable_simulation',
        text: 'Visual Memory Bank: Assign compatible values to the Variable Container.',
        variableSimConfig: {
          targetSuccesses: 3,
          successMessage: "MEMORY ALLOCATION STABLE. Concepts of strong typing assimilated."
        },
        explanation: "Great job! In Java, the container (variable) must match the shape of the data it holds.",
        xpReward: 0
      }
    ]
  },
  {
    id: 'java-game-puzzle-5',
    title: 'Game 5: Code Constructor',
    description: 'TSusun sintaks Java dengan benar.',
    xpReward: 600,
    questions: [
      {
        id: 'puzzle-game-q1',
        type: 'code_puzzle',
        text: 'Reconstruct the corrupted code fragments into valid statements.',
        codePuzzleConfig: {
          minScoreToPass: 3,
          successMessage: "SYNTAX RECONSTRUCTED. System is fully operational.",
          failMessage: "COMPILATION ERROR. Sequence invalid.",
          puzzles: [
            {
              id: 'puz-1',
              fragments: ['umur', 'int', '17', '=', ';'],
              correctSequence: ['int', 'umur', '=', '17', ';']
            },
            {
              id: 'puz-2',
              fragments: ['=', '"Andi"', 'String', 'nama', ';'],
              correctSequence: ['String', 'nama', '=', '"Andi"', ';']
            },
            {
              id: 'puz-3',
              fragments: ['isStudent', 'boolean', ';', 'true', '='],
              correctSequence: ['boolean', 'isStudent', '=', 'true', ';']
            }
          ]
        },
        explanation: "All systems online. You have mastered the syntax of variable declaration!",
        xpReward: 0
      }
    ]
  },
  {
    id: 'java-lab-1',
    title: 'Mini Java Lab',
    description: 'Praktek Langsung: Membuat Program Biodata',
    xpReward: 200,
    questions: [
      {
        id: 'lab-task-1',
        type: 'simulation',
        text: `**TUGAS FINAL: BIODATA SISTEM**\n\nSaatnya menggabungkan semua pengetahuanmu! Sistem membutuhkan data biodata yang valid untuk melanjutkan proses.\n\n**Target Output:**\n\`\`\`text\nNama: Andi\nUmur: 17\nAktif: true\n\`\`\`\n\n**Instruksi:**\n1.  Buat variabel **nama** (String) isi dengan "Andi".\n2.  Buat variabel **umur** (int) isi dengan 17.\n3.  Buat variabel **aktif** (boolean) isi dengan true.`,
        codeSnippet: '',
        simulationConfig: {
          runButtonLabel: "Build & Run Project",
          defaultCode: `public class Main {
  public static void main(String[] args) {
    // 1. Definisikan variabel 'nama'
    
    // 2. Definisikan variabel 'umur'
    
    // 3. Definisikan variabel 'aktif'
    

    // --- JANGAN UBAH KODE DI BAWAH INI ---
    // Kode ini akan mencetak variabel buatanmu ke layar
    System.out.println("Nama: " + nama);
    System.out.println("Umur: " + umur);
    System.out.println("Aktif: " + aktif);
  }
}`,
          validation: {
            requiredMatches: [
              'String\\s+nama\\s*=\\s*"Andi"\\s*;',
              'int\\s+umur\\s*=\\s*17\\s*;',
              'boolean\\s+aktif\\s*=\\s*true\\s*;'
            ],
            successMessage: "PROGRAM OUTPUT:\n----------------\nNama: Andi\nUmur: 17\nAktif: true\n----------------\n\n✅ SYSTEM INTEGRITY RESTORED.",
            errorMessage: "❌ BUILD FAILED: Pastikan kamu membuat 3 variabel (nama, umur, aktif) dengan tipe data dan nilai yang tepat.",
            errorMatchers: [
              {
                regex: 'String\\s+nama\\s*=\\s*Andi\\s*;',
                message: "❌ ERROR: 'Andi' adalah teks, harus diapit tanda kutip dua -> \"Andi\""
              },
              {
                regex: 'int\\s+umur\\s*=\\s*"17"\\s*;',
                message: "❌ ERROR: Umur (int) adalah angka, jangan pakai tanda kutip."
              },
              {
                regex: 'boolean\\s+aktif\\s*=\\s*"true"\\s*;',
                message: "❌ ERROR: Boolean true/false adalah keyword, jangan pakai tanda kutip."
              }
            ]
          }
        },
        explanation: "Luar biasa! Kamu telah berhasil mendeklarasikan variabel String, int, dan boolean dalam satu program utuh. Ini adalah inti dari pemrograman Java.",
        xpReward: 200
      }
    ]
  },
  {
    id: 'java-quiz-8',
    title: 'Final Quiz',
    description: 'Uji Pemahamanmu!',
    xpReward: 1000, // 100 per question
    questions: [
      {
        id: 'quiz-q1',
        type: 'quiz',
        text: 'Apa fungsi dari `int` pada kode berikut?',
        codeSnippet: 'int umur = 17;',
        options: [
          'Menyimpan teks',
          'Menentukan nama variabel',
          'Menentukan tipe data bilangan bulat',
          'Menampilkan nilai ke layar'
        ],
        correctAnswerIndex: 2,
        explanation: 'int digunakan untuk menyimpan bilangan bulat tanpa desimal.'
      },
      {
        id: 'quiz-q2',
        type: 'quiz',
        text: 'Tipe data yang digunakan untuk menyimpan teks pada Java adalah ...',
        options: [
          'char',
          'String',
          'text',
          'varchar'
        ],
        correctAnswerIndex: 1,
        explanation: 'String adalah tipe data non-primitif untuk menyimpan kumpulan karakter.'
      },
      {
        id: 'quiz-q3',
        type: 'quiz',
        text: 'Manakah deklarasi variabel yang BENAR?',
        options: [
          'int 2nilai = 90;',
          'int nilai ujian = 90;',
          'int nilaiUjian = 90;',
          'int nilai-ujian = 90;'
        ],
        correctAnswerIndex: 2,
        explanation: 'Identifier tidak boleh diawali angka, mengandung spasi, atau simbol operator.'
      },
      {
        id: 'quiz-q4',
        type: 'quiz',
        text: 'Mengapa kode berikut menyebabkan error?',
        codeSnippet: 'int nilai = "90";',
        options: [
          'Nilai terlalu besar',
          'Salah penulisan variabel',
          'Tipe data tidak sesuai',
          'Kurang tanda titik koma'
        ],
        correctAnswerIndex: 2,
        explanation: 'int hanya dapat menyimpan angka, sedangkan "90" adalah String.'
      },
      {
        id: 'quiz-q5',
        type: 'quiz',
        text: 'Manakah contoh identifier yang SALAH?',
        options: [
          'namaSiswa',
          '_jumlah',
          '$total',
          'boolean'
        ],
        correctAnswerIndex: 3,
        explanation: 'boolean adalah keyword Java dan tidak boleh digunakan sebagai identifier.'
      },
      {
        id: 'quiz-q6',
        type: 'quiz',
        text: 'Java membedakan huruf besar dan huruf kecil. Pernyataan ini disebut ...',
        options: [
          'Case neutral',
          'Case sensitive',
          'Uppercase only',
          'Lowercase only'
        ],
        correctAnswerIndex: 1,
        explanation: 'Java bersifat case sensitive, sehingga nama variabel harus konsisten.'
      },
      {
        id: 'quiz-q7',
        type: 'quiz',
        text: 'Tipe data untuk menyimpan nilai true atau false adalah ...',
        options: [
          'int',
          'char',
          'boolean',
          'String'
        ],
        correctAnswerIndex: 2,
        explanation: 'boolean hanya memiliki dua nilai: true dan false.'
      },
      {
        id: 'quiz-q8',
        type: 'quiz',
        text: 'Mengapa char menggunakan tanda petik satu (\')?',
        codeSnippet: "char grade = 'A';",
        options: [
          'Karena String memakai petik satu',
          'Karena char hanya menyimpan satu karakter',
          'Karena tanda petik dua hanya untuk angka',
          'Karena aturan Java bebas'
        ],
        correctAnswerIndex: 1,
        explanation: 'char menyimpan satu karakter dan harus menggunakan tanda petik satu.'
      },
      {
        id: 'quiz-q9',
        type: 'quiz',
        text: 'Manakah deklarasi yang BENAR untuk menyimpan nilai desimal?',
        options: [
          'int tinggi = 170.5;',
          'float tinggi = 170.5f;',
          'char tinggi = 170.5;',
          'boolean tinggi = true;'
        ],
        correctAnswerIndex: 1,
        explanation: 'float digunakan untuk bilangan desimal dan memerlukan akhiran f.'
      },
      {
        id: 'quiz-q10',
        type: 'quiz',
        text: 'Apa kesalahan pada kode berikut?',
        codeSnippet: 'int nilaiAkhir;\nnilaiakhir = 80;',
        options: [
          'Kurang titik koma',
          'Salah tipe data',
          'Perbedaan huruf besar dan kecil pada nama variabel',
          'Variabel belum diisi'
        ],
        correctAnswerIndex: 2,
        explanation: 'Java bersifat case sensitive sehingga nilaiAkhir dan nilaiakhir berbeda.'
      }
    ]
  },
  {
    id: 'java-reflection-9',
    title: 'Refleksi',
    description: 'Refleksi Diri',
    xpReward: 0,
    questions: [
       {
          id: 'refl-1',
          type: 'checklist',
          text: '**Refleksi Pembelajaran**\n\nSelamat! Kamu telah menyelesaikan modul dasar. Apa yang sudah kamu pelajari?',
          checklistItems: [
             "Saya mengerti perbedaan int, String, boolean, dan char.",
             "Saya bisa membuat variabel dengan nama yang valid (Identifier).",
             "Saya paham kenapa program bisa error karena tipe data.",
             "Saya siap belajar materi selanjutnya!"
          ],
          explanation: "Perjalananmu sebagai programmer baru saja dimulai. Keep coding!"
       }
    ]
  }
];