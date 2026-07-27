export function isAdult(birth_date) {
    const today = new Date();
    let age = today.getFullYear() - birth_date.getFullYear();
    const hasHadBirthdayThisYear = today.getMonth() > birth_date.getMonth() ||
        (today.getMonth() === birth_date.getMonth() &&
            today.getDate() >= birth_date.getDate());
    if (!hasHadBirthdayThisYear) {
        age--;
    }
    return age >= 18;
}
//# sourceMappingURL=date.js.map