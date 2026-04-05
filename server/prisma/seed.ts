import { PrismaClient } from "../src/generated/prisma";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || "file:./dev.db",
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // Clean existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  // === CATEGORIES ===
  const catCongNghiep = await prisma.category.create({
    data: {
      name: "Sơn Công Nghiệp",
      slug: "son-cong-nghiep",
      description:
        "Dòng sơn chuyên dụng cho các công trình công nghiệp, nhà xưởng, kết cấu thép và bề mặt kim loại.",
      image:
        "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80",
    },
  });

  const catTrangTri = await prisma.category.create({
    data: {
      name: "Sơn Trang Trí",
      slug: "son-trang-tri",
      description:
        "Dòng sơn nội thất và ngoại thất cho các công trình dân dụng, biệt thự, chung cư.",
      image:
        "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=800&q=80",
    },
  });

  console.log(`✅ Created ${2} categories`);

  // === PRODUCTS ===
  const products = await Promise.all([
    // --- Sơn Công Nghiệp (4 products) ---
    prisma.product.create({
      data: {
        name: "Sơn Chống Rỉ ATA-CR01",
        slug: "son-chong-ri-ata-cr01",
        price: 450000,
        description:
          "Sơn chống rỉ cao cấp, bảo vệ bề mặt kim loại khỏi ăn mòn và oxy hóa trong môi trường khắc nghiệt.",
        detailDescription:
          "Sơn Chống Rỉ ATA-CR01 là giải pháp bảo vệ kim loại hàng đầu, được thiết kế đặc biệt cho các công trình công nghiệp và kết cấu thép. Công thức gốc alkyd biến tính cho khả năng bám dính vượt trội trên bề mặt sắt, thép, kẽm. Sản phẩm tạo lớp màng bảo vệ kép: chống rỉ sét và chống ăn mòn hóa học, phù hợp với môi trường nhà xưởng, cầu cảng, và các kết cấu ngoài trời.",
        image:
          "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&q=80",
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&q=80",
          "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80",
          "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80",
        ]),
        weight: "5kg",
        coverage: "10-12 m²/lít",
        dryTime: "2-4 giờ",
        finish: "Bóng mờ (Semi-gloss)",
        inStock: true,
        tags: JSON.stringify(["chống rỉ", "công nghiệp", "kim loại", "bán chạy"]),
        categoryId: catCongNghiep.id,
      },
    }),

    prisma.product.create({
      data: {
        name: "Sơn Epoxy ATA-EP02",
        slug: "son-epoxy-ata-ep02",
        price: 1250000,
        description:
          "Sơn epoxy 2 thành phần, chống mài mòn, chịu hóa chất, dùng cho sàn nhà xưởng và bể chứa.",
        detailDescription:
          "Sơn Epoxy ATA-EP02 là hệ sơn 2 thành phần (A+B) gốc epoxy cao cấp, chuyên dụng cho bề mặt sàn bê tông nhà xưởng, kho bãi, bệnh viện, và phòng sạch. Sản phẩm cho độ cứng màng sơn cao, chịu mài mòn tốt, kháng hóa chất và dung môi. Bề mặt sau khi sơn phẳng mịn, dễ vệ sinh, đáp ứng tiêu chuẩn vệ sinh công nghiệp.",
        image:
          "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80",
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80",
          "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80",
          "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80",
        ]),
        weight: "20kg (bộ A+B)",
        coverage: "6-8 m²/lít/lớp",
        dryTime: "6-8 giờ",
        finish: "Bóng (Gloss)",
        inStock: true,
        tags: JSON.stringify(["epoxy", "sàn công nghiệp", "chống mài mòn"]),
        categoryId: catCongNghiep.id,
      },
    }),

    prisma.product.create({
      data: {
        name: "Sơn Chịu Nhiệt ATA-CN03",
        slug: "son-chiu-nhiet-ata-cn03",
        price: 780000,
        description:
          "Sơn chịu nhiệt lên đến 600°C, chuyên dùng cho ống khói, lò hơi, hệ thống xả nhiệt.",
        detailDescription:
          "Sơn Chịu Nhiệt ATA-CN03 được phát triển với công nghệ silicone biến tính, chịu nhiệt liên tục lên đến 600°C. Sản phẩm bám dính tốt trên bề mặt kim loại, bảo vệ kết cấu khỏi oxy hóa nhiệt, phù hợp cho ống khói, lò hơi, hệ thống tản nhiệt, và các thiết bị công nghiệp hoạt động ở nhiệt độ cao.",
        image:
          "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&q=80",
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&q=80",
          "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80",
        ]),
        weight: "5kg",
        coverage: "8-10 m²/lít",
        dryTime: "1-2 giờ",
        finish: "Mờ (Matt)",
        inStock: true,
        tags: JSON.stringify(["chịu nhiệt", "công nghiệp", "silicone"]),
        categoryId: catCongNghiep.id,
      },
    }),

    prisma.product.create({
      data: {
        name: "Sơn Kẽm ATA-KE04",
        slug: "son-kem-ata-ke04",
        price: 2200000,
        description:
          "Sơn giàu kẽm vô cơ, bảo vệ catot cho kết cấu thép, đáp ứng tiêu chuẩn SSPC.",
        detailDescription:
          "Sơn Kẽm ATA-KE04 là hệ sơn lót giàu kẽm vô cơ (Inorganic Zinc-Rich Primer) với hàm lượng kẽm bụi > 80%, cung cấp khả năng bảo vệ catot xuất sắc cho kết cấu thép. Sản phẩm đáp ứng tiêu chuẩn SSPC-Paint 20 và được sử dụng rộng rãi trong các dự án cầu đường, nhà máy, và công trình ngoài khơi.",
        image:
          "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80",
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80",
          "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&q=80",
        ]),
        weight: "20kg",
        coverage: "4-6 m²/lít",
        dryTime: "4-6 giờ",
        finish: "Mờ (Matt)",
        inStock: false, // <<< Out-of-stock product
        tags: JSON.stringify(["kẽm", "chống ăn mòn", "SSPC", "cao cấp"]),
        categoryId: catCongNghiep.id,
      },
    }),

    // --- Sơn Trang Trí (3 products) ---
    prisma.product.create({
      data: {
        name: "Sơn Nội Thất ATA-NT05",
        slug: "son-noi-that-ata-nt05",
        price: 350000,
        description:
          "Sơn nội thất cao cấp, phủ mịn, kháng khuẩn, an toàn cho sức khỏe gia đình.",
        detailDescription:
          "Sơn Nội Thất ATA-NT05 là dòng sơn nước cao cấp dành cho tường nội thất. Công thức được cải tiến với công nghệ kháng khuẩn Ag+ và VOC cực thấp, an toàn cho sức khỏe. Sản phẩm cho màng sơn mịn đẹp, khả năng phủ cao, chống bám bẩn và dễ lau chùi. Bảng màu phong phú với hơn 1.500 sắc màu theo hệ NCS.",
        image:
          "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=800&q=80",
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=800&q=80",
          "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80",
          "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800&q=80",
        ]),
        weight: "18 lít",
        coverage: "12-14 m²/lít/lớp",
        dryTime: "1-2 giờ",
        finish: "Mờ mịn (Eggshell)",
        inStock: true,
        tags: JSON.stringify(["nội thất", "kháng khuẩn", "an toàn", "bán chạy"]),
        categoryId: catTrangTri.id,
      },
    }),

    prisma.product.create({
      data: {
        name: "Sơn Ngoại Thất ATA-NG06",
        slug: "son-ngoai-that-ata-ng06",
        price: 520000,
        description:
          "Sơn ngoại thất chống nứt, chống thấm, bền màu trước tia UV và thời tiết khắc nghiệt.",
        detailDescription:
          "Sơn Ngoại Thất ATA-NG06 là giải pháp bảo vệ toàn diện cho mặt ngoài công trình. Công nghệ Acrylic thuần cao cấp giúp màng sơn đàn hồi, chống nứt vi mô, chống thấm và chống rêu mốc hiệu quả. Sản phẩm bền màu vượt trội trước tia UV, giữ nguyên thẩm mỹ công trình trong thời gian dài. Phù hợp cho biệt thự, chung cư, và các công trình thương mại.",
        image:
          "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80",
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80",
          "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=800&q=80",
          "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800&q=80",
        ]),
        weight: "18 lít",
        coverage: "10-12 m²/lít/lớp",
        dryTime: "2-3 giờ",
        finish: "Bóng mờ (Semi-gloss)",
        inStock: true,
        tags: JSON.stringify(["ngoại thất", "chống thấm", "chống nứt", "UV"]),
        categoryId: catTrangTri.id,
      },
    }),

    prisma.product.create({
      data: {
        name: "Sơn Lót Đa Năng ATA-LT07",
        slug: "son-lot-da-nang-ata-lt07",
        price: 280000,
        description:
          "Sơn lót đa năng cho cả bề mặt tường và gỗ, tăng độ bám dính và độ phủ cho lớp sơn phủ.",
        detailDescription:
          "Sơn Lót Đa Năng ATA-LT07 là giải pháp sơn lót toàn diện, sử dụng được trên nhiều loại bề mặt: tường vữa xi măng, bê tông, gỗ, thạch cao. Sản phẩm thấm sâu vào bề mặt, tăng cường độ bám dính cho lớp sơn phủ, ngăn kiềm, chống ẩm, và giúp tiết kiệm sơn phủ lên đến 20%. Phù hợp sử dụng cho cả công trình mới và sửa chữa.",
        image:
          "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800&q=80",
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800&q=80",
          "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=800&q=80",
        ]),
        weight: "18 lít",
        coverage: "14-16 m²/lít",
        dryTime: "1 giờ",
        finish: "Mờ (Matt)",
        inStock: true,
        tags: JSON.stringify(["sơn lót", "đa năng", "tiết kiệm"]),
        categoryId: catTrangTri.id,
      },
    }),
  ]);

  console.log(`✅ Created ${products.length} products`);
  console.log(
    `   - Sơn Công Nghiệp: ${products.filter((p) => p.categoryId === catCongNghiep.id).length}`
  );
  console.log(
    `   - Sơn Trang Trí: ${products.filter((p) => p.categoryId === catTrangTri.id).length}`
  );
  console.log(
    `   - Out of stock: ${products.filter((p) => !p.inStock).length}`
  );

  console.log("\n🎉 Seeding complete!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seed error:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
