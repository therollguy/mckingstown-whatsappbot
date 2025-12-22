/**
 * McKingstown Outlets Database
 * Complete list of all franchise outlets across India and International
 */

const outlets = [
  { id: 1, name: 'ANNA NAGAR (Brand Outlet)', city: 'Chennai', state: 'Tamil Nadu', address: '1734, 18th Main Rd, Bharathi Nagar, I Block, Anna Nagar, Chennai, Tamil Nadu 600040', phone: '8939900567', type: 'Brand Outlet' },
  { id: 2, name: 'TAMBARAM', city: 'Chennai', state: 'Tamil Nadu', address: 'No:149, Velachery Road, East Tambaram, Tambaram, Chennai, Tamil Nadu - 600059', phone: '9884029730', opened: '27-09-2021' },
  { id: 3, name: 'MUTHUPET', city: 'Muthupet', state: 'Tamil Nadu', address: 'No: 263, Star Complex, Old Bus Stand, TTP Road, Muthupet, Tamil Nadu - 614704', phone: '8838885004', opened: '08-12-2021' },
  { id: 4, name: 'KILPAUK', city: 'Chennai', state: 'Tamil Nadu', address: 'No: 46/46D, Old No: 19, Barnaby Road, Kilpauk, Chennai, Tamil Nadu - 600010', phone: '9363077774', opened: '20-12-2021' },
  { id: 5, name: 'PERUMBAKKAM', city: 'Chennai', state: 'Tamil Nadu', address: 'Plot No: 27, Vijay Nagar, Perumbakkam, Sholinganallur Main Road, Medavakkam, Chennai, Tamil Nadu- 600100', phone: '8925755574', opened: '09-06-2022' },
  { id: 6, name: 'VALASARAVAKKAM', city: 'Chennai', state: 'Tamil Nadu', address: 'No: 50, Old No: 164, Arcot Road, Valasaravakkam, Chennai, Tamil Nadu - 600087', phone: '9150835556', opened: '01-07-2022' },
  { id: 7, name: 'ADYAR (Brand Outlet)', city: 'Chennai', state: 'Tamil Nadu', address: 'No: 18/16, Second Main Road, near Nilgiris Super Market, Kasturba Nagar, Adyar, Chennai, Tamil Nadu - 600020', phone: '9840323136', type: 'Brand Outlet', opened: '15-07-2022' },
  { id: 8, name: 'NANGANALLUR', city: 'Chennai', state: 'Tamil Nadu', address: '5B, 6th Main Road, Opposite Independence Day Park, TNGO Colony, Nanganallur, Chennai, Tamil Nadu - 600061', phone: '9159855556', opened: '20-07-2022' },
  { id: 9, name: 'PERVALUR', city: 'Chennai', state: 'Tamil Nadu', address: 'No: 55, SRP Colony Main Road, 7th Street, Peravallur, Chennai, Tamil Nadu - 600082', phone: '6380808084', opened: '31-08-2022' },
  { id: 10, name: 'P N PUDUR', city: 'Coimbatore', state: 'Tamil Nadu', address: 'No.237/ 184, Marudhamalai Main Road, P.N Pudur, Coimbatore, Tamil Nadu - 641041', phone: '9035903540', opened: '07-11-2022' },
  { id: 11, name: 'KODAMBAKKAM', city: 'Chennai', state: 'Tamil Nadu', address: 'No:13, Murugesan Street, behind HDFC bank, Kodambakkam, Chennai, Tamil Nadu - 600024', phone: '9840135285', opened: '23-12-2022' },
  { id: 12, name: 'KORATTUR', city: 'Chennai', state: 'Tamil Nadu', address: 'No: 75-A, Railway Station Road, behind Korattur Bus Depot, Chennai, Tamil Nadu - 600080', phone: '8939543999', opened: '18-01-2023' },
  { id: 13, name: 'MADIPAKKAM', city: 'Chennai', state: 'Tamil Nadu', address: 'No: 22A, Sabari Salai, Ayyappan Nagar, Madipakkam, Chennai, Tamil Nadu - 600091', phone: '7845944600', opened: '16-02-2023' },
  { id: 14, name: 'MADHANANDAPURAM', city: 'Chennai', state: 'Tamil Nadu', address: 'No: 29, Raja Rajeswari Nagar, Sarojini Street, Mugalivakkam Road, Madhanandapuram, Chennai, Tamil Nadu - 600125', phone: '9790111256', opened: '17-02-2023' },
  { id: 15, name: 'AMBATUR PUDUR', city: 'Chennai', state: 'Tamil Nadu', address: 'No. 175/70, Red Hills Main Road, Pudur, Ambattur, Chennai, Tamil Nadu - 600053', phone: '8610755345', opened: '23-02-2023' },
  { id: 16, name: 'MOGAPPAIR EAST', city: 'Chennai', state: 'Tamil Nadu', address: 'No: 5/448, MIG, Pari Salai, Mogappair East, Chennai, Tamil Nadu 600037', phone: '9159556665', opened: '02-03-2023' },
  { id: 17, name: 'AYANAVARAM', city: 'Chennai', state: 'Tamil Nadu', address: 'Old No: 334, New No: 138, Konnur High Road, Venkatesapuram Colony, Ayanavaram, Chennai, Tamil Nadu - 600023', phone: '7358110227', opened: '08-03-2023' },
  { id: 18, name: 'AMINJIKARAI', city: 'Chennai', state: 'Tamil Nadu', address: 'Plot No: 30, Door No: 16, Railway Colony 3rd Street, Nelson Manickam Road, Aminjikarai, Chennai, Tamil Nadu - 600029', phone: '7305973699', opened: '30-03-2023' },
  { id: 19, name: 'SOWCARPET', city: 'Chennai', state: 'Tamil Nadu', address: 'No: 72, Amman Koil Street, Sowcarpet, George Town, Chennai, Tamil Nadu - 600001', phone: '8680000191', opened: '05-04-2023' },
  { id: 20, name: 'MOGAPPAIR WEST', city: 'Chennai', state: 'Tamil Nadu', address: 'Plot No: C-5/2, Reddipalayam Road, Mogappair West, Nolambur, Chennai, Tamil Nadu - 600037', phone: '7845118938', opened: '12-04-2023' },
  { id: 21, name: 'IYAPPANTHANGAL', city: 'Chennai', state: 'Tamil Nadu', address: 'No: 2, Subbiah Nagar, A.N. Elumalai Salai, Oil Mill Road, Iyyappanthangal, Chennai, Tamil Nadu - 600056', phone: '9363396669', opened: '16-04-2023' },
  { id: 22, name: 'BESANT NAGAR', city: 'Chennai', state: 'Tamil Nadu', address: 'No: 61/C, Velankanni Church Road, Besant Nagar, Chennai, Tamil Nadu - 600090', phone: '9087171440', opened: '09-05-2023' },
  { id: 23, name: 'KOVILAMBAKKAM', city: 'Chennai', state: 'Tamil Nadu', address: 'PPR Complex, 1/70, Medavakkam Main Road, Nanmangalam, Chennai, Tamil Nadu - 600129', phone: '9655033833', opened: '22-05-2023' },
  { id: 24, name: 'KOLATHUR', city: 'Chennai', state: 'Tamil Nadu', address: 'STR Tower, No:109, Periyar Street, Red Hills Road, Makkaram Thottam, Kolathur, Chennai, Tamil Nadu - 600099', phone: '7305962634', opened: '25-05-2023' },
  { id: 25, name: 'VINAYAGA PURAM', city: 'Chennai', state: 'Tamil Nadu', address: 'No:16, GG Complex, Vignesh Nagar, Vinayagapuram, Chennai, Tamil Nadu - 600099', phone: '9092923330', opened: '07-06-2023' },
  { id: 26, name: 'ROYAPURAM', city: 'Chennai', state: 'Tamil Nadu', address: 'New No: 76, Old No: 41, West Madha Church Street, Royapuram, Chennai, Tamil Nadu - 600013', phone: '7305949539', opened: '10-06-2023' },
  { id: 27, name: 'KELAMBAKKAM', city: 'Chennai', state: 'Tamil Nadu', address: 'Devraj Plaza, No:3/45, Rajiv Gandhi Salai, Kelambakkam, Chennai, Tamil Nadu - 603103', phone: '7418636094', opened: '16-07-2023' },
  { id: 28, name: 'MOOLAKADAI', city: 'Chennai', state: 'Tamil Nadu', address: 'No: 42-G, M. H. Road, Moolakadai, Chennai - 600060', phone: '8124344443', opened: '05-08-2023' },
  { id: 29, name: 'MANAPAKKAM', city: 'Chennai', state: 'Tamil Nadu', address: 'No: 2/559, Dr. Ambethkar Nagar, Manapakkam, Chennai, Tamil Nadu - 600125', phone: '9047177883', opened: '23-08-2023' },
  { id: 30, name: 'SHOLINGANALLUR', city: 'Chennai', state: 'Tamil Nadu', address: 'No:104, Sholinganallur, Old Mahabalipuram Road, Chennai, Tamil Nadu - 600119', phone: '7490039006', opened: '30-08-2023' },
  { id: 31, name: 'VEPERY', city: 'Chennai', state: 'Tamil Nadu', address: 'No:106, Vepery High Road, Chennai, Tamil Nadu - 600007', phone: '7448811130', opened: '04-09-2023' },
  { id: 32, name: 'SALIGRAMAM KK NAGAR', city: 'Chennai', state: 'Tamil Nadu', address: 'No:2/5, 6th Cross Street, 5th Main Street, Vijayaragavapuram, Saligramam, Chennai, Tamil Nadu - 600093', phone: '6369106369', opened: '06-09-2023' },
  { id: 33, name: 'SALIGRAMAM JALPAN', city: 'Chennai', state: 'Tamil Nadu', address: 'No:1, Plot No:36, Kalaignar Karunanidhi Salai, Saligramam, Chennai, Tamil Nadu - 600093', phone: '9360859360', opened: '06-09-2023' },
  { id: 34, name: 'TIRUVOTTRIYUR', city: 'Chennai', state: 'Tamil Nadu', address: 'Old No:161/1, New No:359, T.H.Road, Tiruvottriyur, Chennai, Tamil Nadu- 600019', phone: '8939305551', opened: '18-09-2023' },
  { id: 35, name: 'EDAYARPALAYAM', city: 'Coimbatore', state: 'Tamil Nadu', address: 'Koundampalayam Road, Edayarpalayam, Coimbatore, Tamil Nadu - 641025', phone: '7200287930', opened: '17-10-2023' },
  { id: 36, name: 'ROYAPETTAH', city: 'Chennai', state: 'Tamil Nadu', address: 'No:101, Dr. Besant Road, Royapettah, Chennai, Tamil Nadu - 600014', phone: '9384845773', opened: '02-10-2023' },
  { id: 37, name: 'CHITLAPAKKAM', city: 'Chennai', state: 'Tamil Nadu', address: 'No:14/21, Anna Street, Chitlapakkam, Chennai, Tamil Nadu - 600064', phone: '9176525556', opened: '04-10-2023' },
  { id: 38, name: 'RAMAPURAM', city: 'Chennai', state: 'Tamil Nadu', address: 'New No:4/2, Kalasathamman Koil Street, Ramapuram, Chennai, Tamil Nadu - 600089', phone: '7200512698', opened: '09-10-2023' },
  { id: 39, name: 'WEST MAMBALAM', city: 'Chennai', state: 'Tamil Nadu', address: 'No: 22, 37, Lake View Road, Jothi Nagar, West Mambalam, Chennai, Tamil Nadu - 600033', phone: '9884000408', opened: '17-10-2023' },
  { id: 40, name: 'AMBATTUR OT', city: 'Chennai', state: 'Tamil Nadu', address: 'No: 46, Cholambedu Rd, Tiruvenkadam Nagar, Cholapuram, Ambattur, Chennai, Tamil Nadu - 600053', phone: '9944799449', opened: '24-10-2023' },
  { id: 41, name: 'VIDYARANYAPURA (Brand Outlet)', city: 'Bangalore', state: 'Karnataka', address: 'No: 465, 12th Main, 3 Block, HMT Layout, Vidyaranyapura, Bangalore - 560 097', phone: '9962999975', type: 'Brand Outlet', opened: '23-10-2023' },
  { id: 42, name: 'NAGAPATTINUM', city: 'Nagapattinam', state: 'Tamil Nadu', address: 'No: 6, Razack Building, Sir Ahmed St, ASN Colony, Melakottaivasal, Nagapattinam, Tamil Nadu - 611001', phone: '6385301024', opened: '03-12-2023' },
  { id: 43, name: 'MADURAI', city: 'Madurai', state: 'Tamil Nadu', address: 'Shenbakaam Towers, No: 9644/1, Sourashtrapuram, Anna Nagar, Madurai, 625 020', phone: '9043996595', opened: '15-12-2023' },
  { id: 44, name: 'TRIRUPATI', city: 'Tirupati', state: 'Andhra Pradesh', address: 'City Center Complex, 18-1-421, Beside Anjineyaswami Temple, Bhavani Nagar, Tirupati - 517501', phone: '9006662229', opened: '22-01-2024' },
  { id: 45, name: 'MADIPAKKAM 2', city: 'Chennai', state: 'Tamil Nadu', address: 'Plot No: 927, Bazaar Main Road, Ram Nagar South, Madipakkam, Chennai - 600 091', phone: '9150297766', opened: '15-01-2024' },
  { id: 46, name: 'KOTIVAKKAM', city: 'Chennai', state: 'Tamil Nadu', address: '1/583B , Kottivakkam, ECR, Chennai - 600041', phone: '8925750949', opened: '23-01-2024' },
  { id: 47, name: 'THIRIVALLUR', city: 'Thiruvallur', state: 'Tamil Nadu', address: 'No: 69, C.V. Naidu Salai, Thiruvallur Town, Thiruvallur Taluk - 602001', phone: '9363017797', opened: '23-02-2024' },
  { id: 48, name: 'PAMMAL', city: 'Chennai', state: 'Tamil Nadu', address: 'No: 19/10, Gandhi Road, Anna Nagar, Pammal, Chennai - 600075', phone: '9042475556', opened: '26-02-2024' },
  { id: 49, name: 'KARAIKAL', city: 'Karaikal', state: 'Puducherry', address: 'No: 11, Deitha Street, Karaikal, Pondicherry - 609602', phone: '9944757404', opened: '28-02-2024' },
  { id: 50, name: 'ADAJAN SURAT', city: 'Surat', state: 'Gujarat', address: 'B-19, Monarch, NR Kalpvrux Garden, Gouravpath Road, Pal Adajan, Surat - 395009', phone: '8866839373', opened: '19-03-2024' },
  { id: 51, name: 'KODUNGAIYUR', city: 'Chennai', state: 'Tamil Nadu', address: '#2/1, Plot No: 13A, 9th Street, Abirami Avenue, Kodungaiyur, Chennai - 600 118', phone: '9444083679', opened: '20-03-2024' },
  { id: 52, name: 'PATTABIRAM', city: 'Chennai', state: 'Tamil Nadu', address: 'No: 287, CTH Road, Pattabiram, Chennai - 600072', phone: '7305982634', opened: '28-03-2024' },
  { id: 53, name: 'VILLIVAKKAM', city: 'Chennai', state: 'Tamil Nadu', address: '#123/259, MTH Road, Villivakkam, Chennai - 600 049', phone: '9789000414', opened: '08-04-2024' },
  { id: 54, name: 'JAI NAGAR ARUMBAKKAM', city: 'Chennai', state: 'Tamil Nadu', address: 'No: 20A/37, Jai Nagar, 1st Main Road, Arumbakkam, Chennai - 600106', phone: '9500000501', opened: '15-04-2024' },
  { id: 55, name: 'MADHAVARAM', city: 'Chennai', state: 'Tamil Nadu', address: 'No.1/1, Perumal Koil Street, Madhavaram, Chennai - 600060', phone: '9363525606', opened: '22-04-2024' },
  { id: 56, name: 'ALWARPET', city: 'Chennai', state: 'Tamil Nadu', address: 'No.5/1 (Old No.4/1), Ramaswamy Street, Alwarpet, Chennai - 600018', phone: '9363930018', opened: '29-04-2024' },
  { id: 57, name: 'MADURAVOYAL', city: 'Chennai', state: 'Tamil Nadu', address: 'No: 147, No: 85, Mettukuppam Road, Maduravoyal, Chennai - 600095', phone: '9884560028', opened: '03-05-2024' },
  { id: 58, name: 'PERUNGALATHUR', city: 'Chennai', state: 'Tamil Nadu', address: 'No. 35 and 36, Srinivasa Perumal Sannadhi Street, New Perungalathur, Chennai - 600 063', phone: '7418056100', opened: '13-05-2024' },
  { id: 59, name: 'AYAPAKKAM', city: 'Chennai', state: 'Tamil Nadu', address: 'Plot No. 9, TG Anna Nagar, Ayapakkam Main Road, Ambattur, Chennai - 600053', phone: '7550184229', opened: '14-05-2024' },
  { id: 60, name: 'ALAPAKKAM', city: 'Chennai', state: 'Tamil Nadu', address: 'Plot No. 12, 61 B, Alapakkam Main Road, Maduravoyal, Chennai - 600116', phone: '9363620870', opened: '17-05-2024' },
  { id: 61, name: 'KILPAUK TAYLORS ROAD', city: 'Chennai', state: 'Tamil Nadu', address: 'Door No. 188E, Poonamallee High Road, Kilpauk, Chennai - 600010', phone: '9884557788', opened: '24-05-2024' },
  { id: 62, name: 'TIRUPUR', city: 'Tirupur', state: 'Tamil Nadu', address: '209/2, AKP Complex, Gandhi Road, Anupparpalayam Pudur, Tirupur - 641652', phone: '9500595378', opened: '28-05-2024' },
  { id: 63, name: 'KUNDRATHUR', city: 'Chennai', state: 'Tamil Nadu', address: 'Door No. 2, Ground Floor, Kundrathur Main Road, Moondram Kattalai, Chennai - 600069', phone: '9345277789', opened: '09-06-2024' },
  { id: 64, name: 'THIRUVERKADU', city: 'Chennai', state: 'Tamil Nadu', address: 'No. 41, Sivan Temple Road, Vallikollaimedu, Thiruverkadu Chennai, Tamil Nadu - 600077', phone: '6374218380', opened: '09-06-2024' },
  { id: 65, name: 'SEMBAKKAM', city: 'Chennai', state: 'Tamil Nadu', address: 'Plot No. 56/219 B, Velachery Main Road, Sembakkam, Chennai, Tamil Nadu- 600077', phone: '9363099330', opened: '09-06-2024' },
  { id: 66, name: 'VELACHERY', city: 'Chennai', state: 'Tamil Nadu', address: 'New No. 11, Old No. 80 B, CSI Church Gate Road, Annai Indira Nagar, Velachery, Chennai - 600042', phone: '7358744788', opened: '10-06-2024' },
  { id: 67, name: 'SAIBABA COIMBATORE', city: 'Coimbatore', state: 'Tamil Nadu', address: 'No. 3, Bharathi Park Road, 8th Cross, Saibaba Colony, Coimbatore - 641011', phone: '7530053540', opened: '11-06-2024' },
  { id: 68, name: 'PAL ADAJAN SURAT', city: 'Surat', state: 'Gujarat', address: 'Shop No. 16, Ground Floor, The Boulevard, Opp. Western Business Circle, Pal Adajan, Surat - 395009', phone: '7041347724', opened: '11-06-2024' },
  { id: 69, name: 'ANNA NAGAR WEST', city: 'Chennai', state: 'Tamil Nadu', address: 'No. 573-C, T.D Complex, Ground Floor, SBOA School Road, Anna Nagar West Extn, Chennai - 600101', phone: '8925589466', opened: '19-06-2024' },
  { id: 70, name: 'SALEM', city: 'Salem', state: 'Tamil Nadu', address: 'No. 48/3, Rajaji Road, Peramanur, Salem, Tamil Nadu- 636007', phone: '7200560396', opened: '03-07-2024' },
  { id: 71, name: 'TIRUPATTI BAIRAGIPATTEDA', city: 'Tirupati', state: 'Andhra Pradesh', address: 'Door No. 19-12-104 , Bairagipatteda, Tirupati- 517501', phone: '8008659873', opened: '07-07-2024' },
  { id: 72, name: 'PUDUCHERRY', city: 'Puducherry', state: 'Puducherry', address: 'Door No. 350, Ground floor, Villianur Main Rd, Nellithope, Nellitope, Puducherry, Tamil Nadu 605005', phone: '7440744040', opened: '05-08-2024' },
  { id: 73, name: 'ALTHAN SURAT', city: 'Surat', state: 'Gujarat', address: 'Shop No. 1, Ground Floor, Square one, near Sentosa Height, Apcha Nagar, Althan, Surat, Gujarat 395017', phone: '9998429393', opened: '12-08-2024' },
  { id: 74, name: 'VESU SURAT', city: 'Surat', state: 'Gujarat', address: 'GF- 12, Aakash Retail, Opp Square NM Mavani Road, Vesu, Magdalla, Surat, Gujarat 395007', phone: '9998659393', opened: '12-08-2024' },
  { id: 75, name: 'NUNGAMBAKKAM', city: 'Chennai', state: 'Tamil Nadu', address: 'Door No. 33, 66, Valluvar Kottam High Rd, Nungambakkam, Chennai, Tamil Nadu 600034', phone: '7477470072', opened: '14-08-2024' },
  { id: 76, name: 'GERUGAMBAKKAM', city: 'Chennai', state: 'Tamil Nadu', address: 'Door No. 219, Ground Floor, Thiruveka Street, Gerugambakkam, Kancheepuram, Tamil Nadu 600122', phone: '7539967279', opened: '14-08-2024' },
  { id: 77, name: 'ERODE', city: 'Erode', state: 'Tamil Nadu', address: 'H-27, E.V.N Road, Surampatti Naal Road, Erode- 638 009', phone: '9944711266', opened: '22-08-2024' },
  { id: 78, name: 'PERUNGUDI', city: 'Chennai', state: 'Tamil Nadu', address: 'No. 4, Panchayat Main Rd, Phase-1, Vijayendra Nagar, Perungudi, Chennai, Tamil Nadu-600096', phone: '8220802999', opened: '03-09-2024' },
  { id: 79, name: 'AVADI', city: 'Chennai', state: 'Tamil Nadu', address: 'Shop No. 25/1, Kamaraj Nagar, East Main Road, Avadi, Chennai, Tamil Nadu- 600071', phone: '9092323330', opened: '05-09-2024' },
  { id: 80, name: 'SAIDAPET', city: 'Chennai', state: 'Tamil Nadu', address: 'No. 1/1, Bharathi Street, Kaveri Nagar, Saidapet, Chennai, Tamil Nadu 600015', phone: '9597059909', opened: '09-09-2024' },
  { id: 81, name: 'T NAGAR', city: 'Chennai', state: 'Tamil Nadu', address: 'Unit No. A, Ground Floor of No. 2 Rajan street, Off Bazullah Road, Chennai, Tamil Nadu- 600017', phone: '9360901223', opened: '11-09-2024' },
  { id: 82, name: 'PALLIKARNAI', city: 'Chennai', state: 'Tamil Nadu', address: 'No.29, Velachery Main Road, Narayanapuram, Pallikaranai, Chennai, Tamil Nadu- 600100', phone: '7550060814', opened: '13-09-2024' },
  { id: 83, name: 'MEDAVAKKAM', city: 'Chennai', state: 'Tamil Nadu', address: '7/499, Ground Floor, Velachery - Tambaram Main Road, Jalladianpet, Medavakkam, Chennai, Tamil Nadu- 600 100', phone: '9384949604', opened: '16-09-2024' },
  { id: 84, name: 'KARAYAMBEDU', city: 'Chennai', state: 'Tamil Nadu', address: 'No. 787, Nellikuppam Road, Moolakalani, Kayarambedu , Chengalpet, Tamil Nadu- 603202', phone: '8190055009', opened: '17-09-2024' },
  { id: 85, name: 'KEELKATLAI', city: 'Chennai', state: 'Tamil Nadu', address: 'No. 44, Kalaivani Street, Keelkattalai, Chennai- 600 117', phone: '8248581220', opened: '27-09-2024' },
  { id: 86, name: 'MOTERA', city: 'Ahmedabad', state: 'Gujarat', address: 'Shop No. 17 A, Central By Sangath IPL, Next To PVR Cinemas, Motera, Ahmedabad-380005', phone: '9610579898', opened: '04-10-2024' },
  { id: 87, name: 'K. PUDUR', city: 'Madurai', state: 'Tamil Nadu', address: 'No. 25, Iyer Bungalow Road, K. Pudur, Madurai, Tamil Nadu- 625 007', phone: '9677704357', opened: '17-10-2024' },
  { id: 88, name: 'THUDIYALUR', city: 'Coimbatore', state: 'Tamil Nadu', address: 'No. 114/2, Mayura Complex, NGGO Colony Gate, Mettupalayam Road, Thudiyalur, Tamil Nadu – 641017', phone: '9363950051', opened: '21-10-2024' },
  { id: 89, name: 'EGMORE', city: 'Chennai', state: 'Tamil Nadu', address: 'No. 6, Ground Floor, Halls Road, Tamil Salai, Egmore, Chennai, Tamil Nadu- 600008', phone: '7200905549', opened: '28-10-2024' },
  { id: 90, name: 'NAVALUR', city: 'Chennai', state: 'Tamil Nadu', address: 'No.4/62, Ground Floor, Thiruvalluvar Street, Egattur, Near Navalur, Chennai, Tamil Nadu- 600130', phone: '7200981210', opened: '06-11-2024' },
  { id: 91, name: 'PADUR', city: 'Chennai', state: 'Tamil Nadu', address: 'Old No. 1/140, New No. 1/40 A Padur Vill & Po. OMR Main Road, Rajiv Gandhi Salai, Chengalpattu, Tamil Nadu 603103', phone: '9511118890', opened: '14-11-2024' },
  { id: 92, name: 'SAMPATH NAGAR ERODE', city: 'Erode', state: 'Tamil Nadu', address: 'Door No.71/1, Kasianna Street, Nasiyanur Road, Sampath Nagar, Edayankattuva Lasu, Erode, Tamil Nadu- 638011', phone: '9047473309', opened: '27-11-2024' },
  { id: 93, name: 'KARAYANCHAVDI', city: 'Chennai', state: 'Tamil Nadu', address: 'Door No. 57 & 58, Ground Floor, Avadi Main Road, Karayanchavadi, Poonamallee, Chennai, Tamil Nadu- 600056', phone: '9952697457', opened: '28-11-2024' },
  { id: 94, name: 'MENAMBEDU', city: 'Chennai', state: 'Tamil Nadu', address: 'No. 16/3, TNEB Colony, 3rd Avenue Menambedu, Village Karukku Main Road, Ambattur, Chennai, Tamil Nadu- 600053', phone: '9444338496', opened: '14-12-2024' },
  { id: 95, name: 'MATHUR', city: 'Chennai', state: 'Tamil Nadu', address: 'Plot No. 1892, 3rd Main Road,  Mathur,  MMDA,  Chennai,  Tamil Nadu- 600068', phone: '9566139661', opened: '14-12-2024' },
  { id: 96, name: 'PERAMBUR', city: 'Chennai', state: 'Tamil Nadu', address: 'No. 337-339, Paper Mills Road, Shop Nos. 1,3 & 10, Perambur, Chennai, Tamil Nadu- 600011', phone: '9363322339', opened: '23-12-2024' },
  { id: 97, name: 'GANPATHY COIMBATORE', city: 'Coimbatore', state: 'Tamil Nadu', address: 'Door No. 15, Old Sathy Road, Ganapathy, Coimbatore -641006', phone: '9952599155', opened: '26-12-2024' },
  { id: 98, name: 'PERUMBAKKAM NOOKAMPALAYAM', city: 'Chennai', state: 'Tamil Nadu', address: '370/2A, Ground Floor, Harsen Building, Nookampalayam Main Road, Perumbakkam, Chennai, Tamil Nadu- 600100', phone: '8122225331', opened: '30-12-2024' },
  { id: 99, name: 'THIRUMULLAVOYAL', city: 'Chennai', state: 'Tamil Nadu', address: 'Plot No. A1, Ground Floor, GV Mansarovar, West Mada Street, Thirumullaivoyal, Chennai, Tamil Nadu - 600062', phone: '9840702681', opened: '08-01-2025' },
  { id: 100, name: 'DUBAI AL QUSAIS', city: 'Dubai', state: 'UAE', address: 'Mohammad Abdullah Bindemaithan Building, Building No. 11, Shop No. 4, Al Qusais Industrial 2, Damascus Street', phone: '971569670341', type: 'International', opened: '08-01-2025' },
  { id: 101, name: 'PUTHAGARAM', city: 'Chennai', state: 'Tamil Nadu', address: 'No 7, Kadappa Rd, janakiram Nagar, Elumalai Nagar, Ashoka Nagar, Kolathur, Puthagaram, Chennai, Tamilnadu 600099', phone: '7448822303', opened: '03-02-2025' },
  { id: 102, name: 'NRI LAYOUT BANGALORE', city: 'Bangalore', state: 'Karnataka', address: 'New No 32/9 Old No 9/1 Ground Floor KVN Complex F Zone NRI Layout Kalkere Main Rd Ramamurthy Nagar Bengaluru Karnataka 560016', phone: '8431392879', opened: '13-02-2025' },
  { id: 103, name: 'TRICHY 1ST', city: 'Trichy', state: 'Tamil Nadu', address: 'No 20/3, Ground Floor (Maya Enclave), Vayalur Main Road, Inbetween Bishop Heber College and Puthur 4 Road, Trichy, Tamil Nadu -620017', phone: '8300139777', opened: '26-02-2025' },
  { id: 104, name: 'TRICHY 2ND', city: 'Trichy', state: 'Tamil Nadu', address: 'No. 3/244, Thanjai Main Road, South Kattur, Tiruchirappalli, Tamil Nadu - 620019', phone: '9514227707', opened: '28-02-2025' },
  { id: 105, name: 'AYYAPAKKAM TNHB', city: 'Chennai', state: 'Tamil Nadu', address: 'R-73/A, Ayapakkam Housing Board Rd, Rajammal Nagar, TNHB Colony, Annanur, Ayappakkam, Chennai, Tamil Nadu- 600077', phone: '9940993090', opened: '03-03-2025' },
  { id: 106, name: 'SITHALAPAKKAM', city: 'Chennai', state: 'Tamil Nadu', address: 'No. 4/291, Jayadurga Complex, Ottiyambakkam Main Road, Sithalapakkam, Chennai, Tamil Nadu- 600126', phone: '9600896994', opened: '04-03-2025' },
  { id: 107, name: 'MYLAPORE', city: 'Chennai', state: 'Tamil Nadu', address: 'No. 185/248, Royapettah High Road, Rangaiah Garden, Mylapore, Chennai, Tamil Nadu- 600004', phone: '9159875556', opened: '12-03-2025' },
  { id: 108, name: 'VETTUVENKANI ECR', city: 'Chennai', state: 'Tamil Nadu', address: 'No: 2/240, East Coast Road, Vettuvankeni, Near Titan and Dominos Chennai, Tamil Nadu - 600115', phone: '9962477277', opened: '24-03-2025' },
  { id: 109, name: 'KUDASAN', city: 'Gandhinagar', state: 'Gujarat', address: 'No 8 Keshav Aradhyam Kudasan Gandhinagar Gujarat 382421', phone: '9624579898', opened: '06-04-2025' },
  { id: 110, name: 'KANCHIPURAM', city: 'Kanchipuram', state: 'Tamil Nadu', address: 'Old 117 New 22 Pillai Street Kanchipuram Chennai Tamilnadu 631501', phone: '9500274212', opened: '18-04-2025' },
  { id: 111, name: 'TIRUPUR PN ROAD', city: 'Tirupur', state: 'Tamil Nadu', address: 'No 82/745 Nesavalar Colony PN Road Thimpalayam Village Tirupur Tamilnadu 641602', phone: '8870123062', opened: '23-04-2025' },
  { id: 112, name: 'GUINDY', city: 'Chennai', state: 'Tamil Nadu', address: 'No 50/1 Ground Floor City Link Road Maduvankarai Guindy Chennai Tamilnadu 600032', phone: '9080577580', opened: '30-04-2025' },
  { id: 113, name: 'KRISHNAGIRI', city: 'Krishnagiri', state: 'Tamil Nadu', address: 'No 43-D Rayappa Street Krishnagiri Tamilnadu 635001', phone: '9944747067', opened: '30-04-2025' },
  { id: 114, name: 'PUTTU THOPPU ROAD MADURAI', city: 'Madurai', state: 'Tamil Nadu', address: 'No 152 Puttu Thoppu Road Madurai Tamilnadu 625001', phone: '9600440601', opened: '30-04-2025' },
  { id: 115, name: 'GUGAI SALEM', city: 'Salem', state: 'Tamil Nadu', address: 'No. 383/684, Ground Floor, Gugai, Trichy Main Road, Salem, Tamil Nadu- 636006', phone: '9944811550', opened: '02-05-2025' },
  { id: 116, name: 'JAFFERKHANPET', city: 'Chennai', state: 'Tamil Nadu', address: 'No 81 Pillayar Koil Street Jafferkhanpet Chennai Tamilnadu 600083', phone: '7200731283', opened: '09-05-2025' },
  { id: 117, name: 'OLD PERUNGALATHUR', city: 'Chennai', state: 'Tamil Nadu', address: 'Old No. 270, New No. 10, Ground Floor, Old Perungalathur, Mudichur Road, Tambaram, Chennai, Tamil Nadu - 600063', phone: '7539977065', opened: '12-05-2025' },
  { id: 118, name: 'KOMARAPALAYAM', city: 'Komarapalayam', state: 'Tamil Nadu', address: 'No. 310/2 A, Salem Main Road, Komarapalayam, Tamil Nadu- 638183', phone: '7305604664', opened: '06-06-2025' },
  { id: 119, name: 'BAZAAR ROAD MYLAPORE', city: 'Chennai', state: 'Tamil Nadu', address: 'New No. 26, Old No. 69, Bazaar Road, Basha Garden, Mylapore, Chennai, Tamil Nadu- 600004', phone: '9677572425', opened: '23-06-2025' },
  { id: 120, name: 'KALAVASAL', city: 'Madurai', state: 'Tamil Nadu', address: 'Door No. 218B, Madurai Theni Road, Chavadi, Kalavasal, Madurai, Tamil Nadu- 625016', phone: '9600740100', opened: '27-06-2025' },
  { id: 121, name: 'SUNDARAPURAM COIMBATORE', city: 'Coimbatore', state: 'Tamil Nadu', address: 'No. 1/36, Madhukkarai Road, Sundarapuram, Coimbatore, Tamil Nadu - 641024', phone: '9940240020', opened: '07-07-2025' },
  { id: 122, name: 'MANNIVAKKAM', city: 'Chennai', state: 'Tamil Nadu', address: 'Old No. 7/147, New No. 7/205, Walajabad Main Road, Mannivakkam, Chennai, Tamil Nadu- 600048', phone: '9677787407', opened: '22-07-2025' },
  { id: 123, name: 'URAPAKKAM', city: 'Chennai', state: 'Tamil Nadu', address: 'No. 153, GST Road, Urapakkam, Chengalpattu, Tamil Nadu - 603202', phone: '9944582055', opened: '18-08-2025' },
  { id: 124, name: 'R S PURAM', city: 'Coimbatore', state: 'Tamil Nadu', address: 'Door No. 40A, 40B, Srinivasa Ragavan Street, Subramaniam Road, R S Puram Coimbatore, Tamil Nadu - 641002', phone: '9500750074', opened: '20-08-2025' },
  { id: 125, name: 'PARTHIPATTHU', city: 'Chennai', state: 'Tamil Nadu', address: 'No. 1, Ground Floor, Avadi Main Road, Paruthipattu, Chennai, Tamil Nadu - 600071', phone: '8778592229', opened: '27-08-2025' },
  { id: 126, name: 'VIVEK NAGAR', city: 'Bangalore', state: 'Karnataka', address: '9, Ground Floor, Egipura Main Road, Vivek Nagar, 2nd Stage, Bengaluru-560047', phone: '7406560047', opened: '04-09-2025' },
  { id: 127, name: 'THILLAI GANGA NAGAR', city: 'Chennai', state: 'Tamil Nadu', address: 'New No. 10/13, 3rd Main Road, Thillai Ganga Nagar Nanganallur, Chennai, Tamil Nadu – 600061', phone: '9087585556', opened: '05-09-2025' },
  { id: 128, name: 'NARIMEDU', city: 'Madurai', state: 'Tamil Nadu', address: 'Door No. 12-A, Ground Floor, P. T Rajan Main Road, Narimedu, Madurai, Tamil Nadu - 625002', phone: '9047474800', opened: '15-09-2025' },
  { id: 129, name: 'KOODAL NAGAR MADURAI', city: 'Madurai', state: 'Tamil Nadu', address: 'Door No. 3/27/4, Ground Floor, Palamedu Main Road, Appathurai Main Street, Koodal Nagar, Madurai, Tamil Nadu - 625018', phone: '9600340601', opened: '26-09-2025' },
  { id: 130, name: 'SARAVANAMPATTI', city: 'Coimbatore', state: 'Tamil Nadu', address: '37 C-2/2, Thudiyalur Main Road, Saravanampatti, Coimbatore, Tamil Nadu - 641035', phone: '8111066009', opened: '06-10-2025' },
  { id: 131, name: 'THIRUPORUR', city: 'Chennai', state: 'Tamil Nadu', address: 'Old No:161/1, New No:359, T.H.Road, Tiruvottriyur, Chennai, Tamil Nadu- 600019', phone: '6385884297', opened: '10-10-2025' },
  { id: 132, name: 'SANKARAPURAM KADAPA', city: 'Kadapa', state: 'Andhra Pradesh', address: 'Door No. 6/1488-1, Sankarapuram, Kadapa, Andhra Pradesh - 516002', phone: '8688640409', opened: '13-10-2025' },
  { id: 133, name: 'VILLAPURAM', city: 'Madurai', state: 'Tamil Nadu', address: 'No: 30, Aruppukottai Main Road, Villapuram, Madurai, Tamil Nadu - 625012', phone: '8637455962', opened: '10-11-2025' },
  { id: 134, name: 'ADVAITHA ASHRAM ROAD', city: 'Salem', state: 'Tamil Nadu', address: 'No 3 Advaitha Ashram Road, Salem, Tamilnadu - 636004', phone: '7094241555', opened: '01-12-2025' }
];

/**
 * Get outlets by city
 */
function getOutletsByCity(cityName) {
  const normalizedCity = cityName.toLowerCase().trim();
  return outlets.filter(outlet => 
    outlet.city.toLowerCase().includes(normalizedCity) ||
    outlet.name.toLowerCase().includes(normalizedCity)
  );
}

/**
 * Get outlets by state
 */
function getOutletsByState(stateName) {
  const normalizedState = stateName.toLowerCase().trim();
  return outlets.filter(outlet => 
    outlet.state.toLowerCase().includes(normalizedState)
  );
}

/**
 * Get brand outlets
 */
function getBrandOutlets() {
  return outlets.filter(outlet => outlet.type === 'Brand Outlet');
}

/**
 * Get all unique cities
 */
function getAllCities() {
  const cities = [...new Set(outlets.map(o => o.city))];
  return cities.sort();
}

/**
 * Get all unique states
 */
function getAllStates() {
  const states = [...new Set(outlets.map(o => o.state))];
  return states.sort();
}

/**
 * Format outlet details for display
 */
function formatOutletDetails(outlet) {
  return `▸ *${outlet.name}*
📍 ${outlet.address}
📞 ${outlet.phone}${outlet.opened ? `\n📅 Opened: ${outlet.opened}` : ''}`;
}

/**
 * Get recent outlets (last 10)
 */
function getRecentOutlets() {
  return outlets.slice(-10).reverse();
}

module.exports = {
  outlets,
  getOutletsByCity,
  getOutletsByState,
  getBrandOutlets,
  getAllCities,
  getAllStates,
  formatOutletDetails,
  getRecentOutlets,
  totalOutlets: outlets.length
};
