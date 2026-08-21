package ru.chessdragons.backend.seed;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import ru.chessdragons.backend.model.AccountType;
import ru.chessdragons.backend.model.Branch;
import ru.chessdragons.backend.model.Event;
import ru.chessdragons.backend.model.GalleryItem;
import ru.chessdragons.backend.model.Homework;
import ru.chessdragons.backend.model.LearningMaterial;
import ru.chessdragons.backend.model.NewsPost;
import ru.chessdragons.backend.model.Payment;
import ru.chessdragons.backend.model.Review;
import ru.chessdragons.backend.model.Role;
import ru.chessdragons.backend.model.ScheduleSlot;
import ru.chessdragons.backend.model.Student;
import ru.chessdragons.backend.model.Subscription;
import ru.chessdragons.backend.model.SubscriptionStatus;
import ru.chessdragons.backend.model.Tariff;
import ru.chessdragons.backend.model.Trainer;
import ru.chessdragons.backend.model.TournamentResult;
import ru.chessdragons.backend.model.User;
import ru.chessdragons.backend.repository.BranchRepository;
import ru.chessdragons.backend.repository.EventRepository;
import ru.chessdragons.backend.repository.GalleryItemRepository;
import ru.chessdragons.backend.repository.HomeworkRepository;
import ru.chessdragons.backend.repository.LearningMaterialRepository;
import ru.chessdragons.backend.repository.NewsPostRepository;
import ru.chessdragons.backend.repository.PaymentRepository;
import ru.chessdragons.backend.repository.ReviewRepository;
import ru.chessdragons.backend.repository.ScheduleSlotRepository;
import ru.chessdragons.backend.repository.StudentRepository;
import ru.chessdragons.backend.repository.SubscriptionRepository;
import ru.chessdragons.backend.repository.TariffRepository;
import ru.chessdragons.backend.repository.TournamentResultRepository;
import ru.chessdragons.backend.repository.TrainerRepository;
import ru.chessdragons.backend.repository.UserRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final BranchRepository branchRepository;
    private final TrainerRepository trainerRepository;
    private final TariffRepository tariffRepository;
    private final ScheduleSlotRepository scheduleSlotRepository;
    private final NewsPostRepository newsPostRepository;
    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final PaymentRepository paymentRepository;
    private final PasswordEncoder passwordEncoder;
    private final ReviewRepository reviewRepository;
    private final HomeworkRepository homeworkRepository;
    private final TournamentResultRepository tournamentResultRepository;
    private final EventRepository eventRepository;
    private final GalleryItemRepository galleryItemRepository;
    private final LearningMaterialRepository learningMaterialRepository;

    @Override
    public void run(String... args) {
        if (branchRepository.count() > 0) {
            // База уже засеяна — не дублируем демо-данные при перезапуске на persistent-БД.
            return;
        }

        List<Branch> branches = branchRepository.saveAll(List.of(
                new Branch(null, "Большая Разночинная ул., 25", "для детей от 4 лет", "10:00–21:00", 1),
                new Branch(null, "ул. Подковырова, 28", "для учеников школы №80 Петроградского района", "10:00–21:00", 2),
                new Branch(null, "ул. Морской Пехоты, 8, корп. 3", null, "10:00–21:00", 3),
                new Branch(null, "Петергофское шоссе, 5, корп. 3", null, "10:00–21:00", 4),
                new Branch(null, "Петровский проспект, 5", null, "10:00–21:00", 5)
        ));

        List<Trainer> trainers = trainerRepository.saveAll(List.of(
                new Trainer(null, "Роман Ловков", "Главный тренер, международный мастер", "ФИДЕ 2451", true,
                        "Вице-чемпион России среди юношей до 12 лет (2000) и до 18 лет (2005). Победитель первенства России по быстрым шахматам до 18 лет (2006). Золото на Клубных чемпионатах России в Высшей Лиге (2006, 2008). Участник чемпионатов мира и Европы.", 1, null, null),
                new Trainer(null, "Александр Шиманов", "Гроссмейстер, мастер спорта России", "2593", false,
                        "Победитель юношеских первенств России, призёр международных соревнований и Олимпиад. Финалист чемпионатов России по блицу и быстрым шахматам.", 2, null, null),
                new Trainer(null, "Даниил Линчевский", "Международный гроссмейстер", "ФИДЕ 2536", false,
                        "Серебряный призёр Кубка России, победитель первенства страны и международных турниров.", 3, null, null),
                new Trainer(null, "Татьяна Столярова", "Тренер", null, false,
                        "Чемпионка Кемерово, Кемеровской области и СФО, призёр всероссийских соревнований.", 4, null, null),
                new Trainer(null, "Алина Шавалиева", "Тренер, первый разряд", null, false,
                        "Победительница юношеских и региональных турниров ХМАО.", 5, null, null),
                new Trainer(null, "Владислав Сластихин", "Тренер", null, false,
                        "Серебряный призёр чемпионатов Республики Коми (2018, 2021), победитель турниров по быстрым шахматам и блицу.", 6, null, null),
                new Trainer(null, "Владимир Фролочкин", "Мастер ФИДЕ", "с 2012 года", false,
                        "Чемпион Санкт-Петербурга среди юношей до 14 лет, участник чемпионатов России и Европы.", 7, null, null),
                new Trainer(null, "Никита Соколов", "Тренер", null, false,
                        "Победитель первенств Ярославской области, призёр ЦФО и студенческих чемпионатов России.", 8, null, null),
                new Trainer(null, "Елизавета Туманова", "Тренер, первый взрослый разряд", null, false,
                        "Чемпионка и призёр первенств Ивановской области.", 9, null, null),
                new Trainer(null, "Татьяна Червякова", "Тренер", null, false,
                        "Чемпионка СЗФО по блицу среди женщин, призёр Кубка России по быстрым шахматам.", 10, null, null),
                new Trainer(null, "Владислав Мухлисов", "Руководитель клуба, КМС", null, false,
                        "Основатель проекта «GOOD CHESS!», более 12 лет обучает детей шахматам.", 11, null, null)
        ));

        List<Tariff> tariffs = tariffRepository.saveAll(List.of(
                new Tariff(null, "Пробное занятие", "При покупке абонемента — в подарок", 1050, null, false, 1, 1),
                new Tariff(null, "Разовое занятие", "Без абонемента", 1500, null, false, 2, 1),
                new Tariff(null, "Абонемент на 4 занятия", "Действует 1 месяц", 4000, null, false, 3, 4),
                new Tariff(null, "Абонемент на 8 занятий", "Самый популярный вариант", 7500, 7200, true, 4, 8),
                new Tariff(null, "«ПРОФИ. ЮНИОРЫ СПБ» (ЕСОД)", "Групповой курс", 8000, null, false, 5, 8)
        ));

        List<ScheduleSlot> slots = scheduleSlotRepository.saveAll(List.of(
                new ScheduleSlot(null, "Дошкольники (первый шаг)", "4–6 лет", "Пн / Ср", "17:00–17:45", 10, 6, branches.get(0), trainers.get(0)),
                new ScheduleSlot(null, "Начинающие", "7–9 лет", "Вт / Чт", "18:00–19:00", 12, 9, branches.get(0), trainers.get(4)),
                new ScheduleSlot(null, "Разрядники", "10–14 лет", "Пн / Ср / Пт", "19:00–20:30", 10, 7, branches.get(1), trainers.get(1)),
                new ScheduleSlot(null, "Дошкольники", "5–6 лет", "Сб", "11:00–11:45", 10, 4, branches.get(2), trainers.get(6)),
                new ScheduleSlot(null, "Начинающие", "7–10 лет", "Вт / Чт", "17:30–18:30", 12, 10, branches.get(3), trainers.get(7)),
                new ScheduleSlot(null, "Продвинутая группа", "11–16 лет", "Пн / Чт", "19:00–20:30", 8, 5, branches.get(4), trainers.get(2))
        ));

        newsPostRepository.saveAll(List.of(
                new NewsPost(null, "Первое занятие в подарок",
                        "Приходите на бесплатное пробное занятие — а при покупке абонемента оно останется в подарок.",
                        "Хотите понять, подойдут ли шахматы вашему ребёнку? Приходите на пробное занятие: посмотрите, как проходят уроки, познакомитесь с тренером. Группы по возрасту и уровню, 5 филиалов в Петербурге.",
                        LocalDate.of(2026, 7, 20), null),
                new NewsPost(null, "Набор в группу «ПРОФИ. ЮНИОРЫ СПБ»",
                        "Открыт набор в группу для разрядников под руководством Романа Ловкова.",
                        "Группа для учеников, готовых к серьёзной турнирной практике. Занятия по программе ЕСОД, разбор партий, подготовка к рейтинговым турнирам.",
                        LocalDate.of(2026, 6, 2), null),
                new NewsPost(null, "Итоги учебного года",
                        "Наши ученики показали отличные результаты на городских первенствах.",
                        "В этом сезоне воспитанники клуба выступили на нескольких турнирах Санкт-Петербурга и Ленинградской области — поздравляем всех участников с ростом рейтинга.",
                        LocalDate.of(2026, 5, 15), null)
        ));

        reviewRepository.saveAll(List.of(
                new Review(null, "Мария, мама ученика", 5, "Сын занимается уже полгода — стал усидчивее, сам просит порешать задачки дома. Тренер находит подход даже к самым непоседливым.", true, LocalDateTime.now()),
                new Review(null, "Дмитрий", 5, "Привели дочку на пробное — осталась в восторге, записались на абонемент в тот же день.", true, LocalDateTime.now()),
                new Review(null, "Ольга", 4, "Удобное расположение зала и вменяемое расписание, можно выбрать вечернюю группу.", true, LocalDateTime.now()),
                new Review(null, "Иван", 5, "Ждём модерации: отличная атмосфера, тренер объясняет с юмором, ребёнок рвётся на занятия.", false, LocalDateTime.now())
        ));

        // Демо-пользователи, чтобы сразу показать личный кабинет и админку без регистрации.
        User admin = userRepository.save(User.builder()
                .email("arina@chessdragons.ru")
                .passwordHash(passwordEncoder.encode("admin123"))
                .fullName("Арина Васильева")
                .role(Role.ADMIN)
                .emailVerified(true)
                .build());

        User parent = userRepository.save(User.builder()
                .email("parent@example.com")
                .passwordHash(passwordEncoder.encode("parent123"))
                .fullName("Мария Петрова")
                .phone("+79219990000")
                .role(Role.PARENT)
                .accountType(AccountType.PARENT)
                .emailVerified(true)
                .phoneVerified(true)
                .build());

        // Демо-логин тренера — Роман Ловков, чтобы сразу показать его личный кабинет.
        User trainerUser = userRepository.save(User.builder()
                .email("lovkov@chessdragons.ru")
                .passwordHash(passwordEncoder.encode("trainer123"))
                .fullName("Роман Ловков")
                .phone("+79219991111")
                .role(Role.TRAINER)
                .accountType(AccountType.ADULT)
                .emailVerified(true)
                .phoneVerified(true)
                .build());
        Trainer headTrainer = trainers.get(0);
        headTrainer.setUser(trainerUser);
        trainerRepository.save(headTrainer);

        Student student = studentRepository.save(new Student(null, "Матвей Петров", "8 лет",
                parent, branches.get(0), slots.get(0)));

        Tariff activeTariff = tariffs.get(3); // Абонемент на 8 занятий
        Subscription subscription = subscriptionRepository.save(new Subscription(null, student, activeTariff,
                activeTariff.getLessonsCount(), 3, LocalDate.now().plusDays(18), SubscriptionStatus.ACTIVE));

        paymentRepository.save(new Payment(null, subscription, activeTariff.getPrice(), "SUCCESS", "stub",
                LocalDateTime.now().minusDays(12)));

        homeworkRepository.saveAll(List.of(
                Homework.builder().student(student).trainer(headTrainer)
                        .description("Решить 5 тактических задач на вилку").points(10)
                        .date(LocalDate.now().minusDays(10)).build(),
                Homework.builder().student(student).trainer(headTrainer)
                        .description("Разобрать партию: итальянская партия, первые 10 ходов").points(8)
                        .date(LocalDate.now().minusDays(3)).build()
        ));

        tournamentResultRepository.saveAll(List.of(
                TournamentResult.builder().student(student)
                        .tournamentName("Первенство Петроградского района среди школ")
                        .date(LocalDate.now().minusMonths(1)).place("3 место").points(15).build()
        ));

        eventRepository.saveAll(List.of(
                Event.builder().title("Открытый блицтурнир для учеников школы")
                        .date(LocalDate.now().plusWeeks(3)).location("Большая Разночинная ул., 25")
                        .description("Внутришкольный турнир для всех групп и уровней — призы и грамоты победителям.")
                        .build(),
                Event.builder().title("Мастер-класс Александра Шиманова")
                        .date(LocalDate.now().plusWeeks(6)).location("ул. Подковырова, 28")
                        .description("Разбор классических партий с гроссмейстером, разбор дебютных ловушек.")
                        .build()
        ));

        galleryItemRepository.saveAll(List.of(
                GalleryItem.builder().title("Итоговый турнир учебного года").eventDate(LocalDate.now().minusMonths(3)).build(),
                GalleryItem.builder().title("Открытое занятие для родителей").eventDate(LocalDate.now().minusMonths(1)).build()
        ));

        learningMaterialRepository.saveAll(List.of(
                LearningMaterial.builder().title("Правила игры для начинающих")
                        .description("Конспект первых правил, обозначений фигур и нотации ходов.")
                        .category("Для дошкольников").build(),
                LearningMaterial.builder().title("100 тактических задач")
                        .description("Сборник упражнений на вилки, связки и открытые линии.")
                        .category("Разрядники").build()
        ));
    }
}
