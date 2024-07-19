<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const year = ref("");
const status = ref("");
const country = ref("");
const category = ref("");

const statusOptions = [
  { value: "trailer", text: "Trailer" },
  { value: "ongoing", text: "Đang tiến hành" },
  { value: "completed", text: "Đã hoàn tất" },
];

const countryOptions = [
  { value: "viet-nam", text: "Việt Nam" },
  { value: "trung-quoc", text: "Trung Quốc" },
  { value: "thai-lan", text: "Thái Lan" },
  { value: "au-my", text: "Âu Mỹ" },
  { value: "han-quoc", text: "Hàn Quốc" },
  { value: "nhat-ban", text: "Nhật Bản" },
  { value: "philippines", text: "Philippines" },
  { value: "malaysia", text: "Malaysia" },
  { value: "dai-loan", text: "Đài Loan" },
  { value: "an-do", text: "Ấn Độ" },
  { value: "uc", text: "Úc" },
  { value: "mexico", text: "Mexico" },
  { value: "canada", text: "Canada" },
  { value: "hong-kong", text: "Hong Kong" },
  { value: "singapore", text: "Singapore" },
  { value: "anh", text: "Anh" },
  { value: "nigeria", text: "Nigeria" },
  { value: "y", text: "Ý" },
  { value: "tay-ban-nha", text: "Tây Ban Nha" },
  { value: "phap", text: "Pháp" },
  { value: "nam-phi", text: "Nam Phi" },
  { value: "a-rap-xe-ut", text: "Ả Rập Xê Út" },
  { value: "quoc-gia-khac", text: "Quốc gia khác" },
  { value: "duc", text: "Đức" },
  { value: "brazil", text: "Brazil" },
  { value: "thuy-dien", text: "Thụy Điển" },
  { value: "ba-lan", text: "Ba Lan" },
  { value: "bi", text: "Bỉ" },
  { value: "thuy-si", text: "Thụy Sĩ" },
  { value: "tho-nhi-ky", text: "Thổ Nhĩ Kỳ" },
  { value: "dan-mach", text: "Đan Mạch" },
  { value: "colombia", text: "Colombia" },
  { value: "argentina", text: "Argentina" },
  { value: "bo-dao-nha", text: "Bồ Đào Nha" },
  { value: "na-uy", text: "Na Uy" },
  { value: "indonesia", text: "Indonesia" },
  { value: "phan-lan", text: "Phần Lan" },
  { value: "chau-phi", text: "Châu Phi" },
  { value: "ha-lan", text: "Hà Lan" },
  { value: "ukraina", text: "Ukraina" },
  { value: "nga", text: "Nga" },
  { value: "ireland", text: "Ireland" },
  { value: "mongolia", text: "Mông Cổ" },
  { value: "sec", text: "Séc" },
  { value: "uae", text: "UAE" },
  { value: "hoa-ky", text: "Hoa Kỳ" },
  { value: "iran", text: "Iran" },
  { value: "ukraine", text: "Ukraine" },
  { value: "peru", text: "Peru" },
  { value: "new-zealand", text: "New Zealand" },
  { value: "romania", text: "Romania" },
  { value: "ao", text: "Áo" },
  { value: "ghana", text: "Ghana" },
  { value: "hungary", text: "Hungary" },
  { value: "kenya", text: "Kenya" },
  { value: "iceland", text: "Iceland" },
  { value: "mauritius", text: "Mauritius" },
  { value: "uruguay", text: "Uruguay" },
  { value: "georgia", text: "Georgia" },
  { value: "bulgaria", text: "Bulgaria" },
  { value: "lien-xo", text: "Liên Xô" },
  { value: "chile", text: "Chile" },
  { value: "cuba", text: "Cuba" },
  { value: "congo", text: "Congo" },
  { value: "malta", text: "Malta" },
  { value: "a-rap-thong-nhat", text: "Ả Rập Thống Nhất" },
  { value: "israel", text: "Israel" },
  { value: "cambodia", text: "Cambodia" },
  { value: "serbia", text: "Serbia" },
  { value: "lithuania", text: "Lithuania" },
  { value: "bahamas", text: "Bahamas" },
  { value: "qatar", text: "Qatar" },
  { value: "albania", text: "Albania" },
  { value: "greenland", text: "Greenland" },
  { value: "maroc", text: "Maroc" },
  { value: "greece", text: "Greece" },
  { value: "kazakhstan", text: "Kazakhstan" },
  { value: "cong-hoa-dominica", text: "Cộng hòa Dominica" },
  { value: "luxembourg", text: "Luxembourg" },
  { value: "slovenia", text: "Slovenia" },
  { value: "belgium", text: "Belgium" },
  { value: "dao-sip", text: "Đảo Síp" },
  { value: "li-bang", text: "Li Băng" },
  { value: "latvia", text: "Latvia" },
  { value: "denmark", text: "Denmark" },
  { value: "venezuela", text: "Venezuela" },
  { value: "hy-lap", text: "Hy Lạp" },
  { value: "belarus", text: "Belarus" },
];

const categoryOptions = [
  { value: "tinh-cam", text: "Tình cảm" },
  { value: "hai-huoc", text: "Hài hước" },
  { value: "chinh-kich", text: "Chính kịch" },
  { value: "phieu-luu", text: "Phiêu lưu" },
  { value: "hanh-dong", text: "Hành động" },
  { value: "tam-ly", text: "Tâm lý" },
  { value: "kinh-di", text: "Kinh dị" },
  { value: "bi-an", text: "Bí ẩn" },
  { value: "vien-tuong", text: "Viễn tưởng" },
  { value: "khoa-hoc", text: "Khoa học" },
  { value: "hinh-su", text: "Hình sự" },
  { value: "chien-tranh", text: "Chiến tranh" },
  { value: "co-trang", text: "Cổ trang" },
  { value: "vo-thuat", text: "Võ thuật" },
  { value: "gia-dinh", text: "Gia đình" },
  { value: "hoat-hinh", text: "Hoạt hình" },
  { value: "tai-lieu", text: "Tài liệu" },
  { value: "hoc-duong", text: "Học đường" },
  { value: "am-nhac", text: "Âm nhạc" },
  { value: "the-thao", text: "Thể thao" },
  { value: "than-thoai", text: "Thần thoại" },
  { value: "lich-su", text: "Lịch sử" },
  { value: "phim-18", text: "Phim 18+" },
  { value: "gia-tuong", text: "Giả tưởng" },
  { value: "gay-can", text: "Gay cấn" },
  { value: "kinh-dien", text: "Kinh điển" },
  { value: "chuong-trinh-truyen-hinh", text: "TV Shows" },
  { value: "mien-tay", text: "Miền Tây" },
  { value: "lang-man", text: "Lãng mạn" },
  { value: "khoa-hoc-vien-tuong", text: "Khoa học viễn tưởng" },
  { value: "phim-hai", text: "Phim hài" },
  { value: "gia-dinh", text: "Gia đình" },
  { value: "phim-nhac", text: "Phim nhạc" },
];

const router = useRouter();

const applyFilter = () => {
  const query = {};
  if (year.value) query.year = year.value;
  if (status.value) query.status = status.value;
  if (country.value) query.country = country.value;
  if (category.value) query.category = category.value;
  query.page = 1;
  router.push({ query });
};

const clearFilter = () => {
  year.value = "";
  status.value = "";
  country.value = "";
  category.value = "";
};
</script>

<template>
  <v-main>
    <div class="mb-2 mt-n2">
      <h3 class="d-flex justify-start">Filter</h3>
      <div class="line" />
    </div>

    <v-form @submit.prevent="applyFilter">
      <v-text-field
        v-model="year"
        label="Năm công chiếu"
        type="number"
        variant="underlined"
        single-line
      ></v-text-field>
      <v-select
        v-model="status"
        :items="statusOptions"
        label="Status"
        item-value="value"
        item-title="text"
        density="comfortable"
      ></v-select>
      <v-select
        v-model="category"
        :items="categoryOptions"
        label="Thể loại"
        item-value="value"
        item-title="text"
        density="comfortable"
      ></v-select>
      <v-select
        v-model="country"
        :items="countryOptions"
        label="Quốc gia"
        item-value="value"
        item-title="text"
        density="comfortable"
      ></v-select>
     
      <div>
        <v-btn type="submit" color="red" class="mr-4">Filter</v-btn>
        <v-btn @click="clearFilter" color="blue">Clear</v-btn>
      </div>
    </v-form>
  </v-main>
</template>
<style scoped>
.line {
  border: 1px solid #b5e745;
  width: 100%;
}

.v-main {
  padding-right: 2rem;
  padding-left: 2rem;
  padding-bottom: 2rem;
  margin-top: ;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}


.v-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}




.v-btn:hover {
  opacity: 0.8;
}
</style>

