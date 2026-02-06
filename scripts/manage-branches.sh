#!/bin/bash

# اسکریپت مدیریت برنچ‌ها برای Monorepo
# استفاده: ./scripts/manage-branches.sh [command]

set -e

# رنگ‌ها برای خروجی
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# توابع کمکی
print_header() {
    echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# بررسی اینکه در یک Git repository هستیم
check_git_repo() {
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        print_error "این پوشه یک Git repository نیست!"
        exit 1
    fi
}

# نمایش وضعیت برنچ‌ها
show_status() {
    print_header "وضعیت برنچ‌ها"
    
    echo -e "${BLUE}برنچ فعلی:${NC}"
    git branch --show-current
    
    echo -e "\n${BLUE}برنچ‌های محلی:${NC}"
    git branch
    
    echo -e "\n${BLUE}برنچ‌های Remote:${NC}"
    git branch -r
    
    echo -e "\n${BLUE}برنچ‌های Merge شده با develop:${NC}"
    if git show-ref --verify --quiet refs/heads/develop; then
        git branch --merged develop | grep -v "\*\|main\|develop" || echo "هیچ برنچ merge شده‌ای وجود ندارد"
    else
        print_warning "برنچ develop وجود ندارد"
    fi
    
    echo -e "\n${BLUE}برنچ‌های Merge نشده:${NC}"
    if git show-ref --verify --quiet refs/heads/develop; then
        git branch --no-merged develop | grep -v "\*\|main\|develop" || echo "همه برنچ‌ها merge شده‌اند"
    else
        print_warning "برنچ develop وجود ندارد"
    fi
}

# پاکسازی برنچ‌های merge شده
cleanup_merged() {
    print_header "پاکسازی برنچ‌های Merge شده"
    
    if ! git show-ref --verify --quiet refs/heads/develop; then
        print_error "برنچ develop وجود ندارد. ابتدا آن را ایجاد کنید."
        exit 1
    fi
    
    # برنچ فعلی را ذخیره می‌کنیم
    current_branch=$(git branch --show-current)
    
    # به develop می‌رویم
    git checkout develop > /dev/null 2>&1
    git pull origin develop > /dev/null 2>&1 || true
    
    # برنچ‌های merge شده را پیدا می‌کنیم
    merged_branches=$(git branch --merged develop | grep -v "\*\|main\|develop" | sed 's/^[ ]*//')
    
    if [ -z "$merged_branches" ]; then
        print_success "هیچ برنچ merge شده‌ای برای پاکسازی وجود ندارد"
    else
        echo -e "${YELLOW}برنچ‌های زیر merge شده‌اند و حذف خواهند شد:${NC}"
        echo "$merged_branches"
        echo ""
        read -p "آیا می‌خواهید این برنچ‌ها را حذف کنید؟ (y/N): " confirm
        
        if [[ $confirm == [yY] || $confirm == [yY][eE][sS] ]]; then
            echo "$merged_branches" | xargs -n 1 git branch -d
            print_success "برنچ‌های merge شده حذف شدند"
        else
            print_warning "عملیات لغو شد"
        fi
    fi
    
    # به برنچ قبلی برمی‌گردیم
    git checkout "$current_branch" > /dev/null 2>&1
}

# همگام‌سازی با remote
sync_remote() {
    print_header "همگام‌سازی با Remote"
    
    print_success "دریافت برنچ‌های remote..."
    git fetch --all --prune
    
    if git show-ref --verify --quiet refs/heads/develop; then
        print_success "همگام‌سازی develop..."
        git checkout develop > /dev/null 2>&1
        git pull origin develop
    else
        print_warning "برنچ develop وجود ندارد"
    fi
    
    if git show-ref --verify --quiet refs/heads/main; then
        print_success "همگام‌سازی main..."
        git checkout main > /dev/null 2>&1
        git pull origin main
    fi
    
    print_success "همگام‌سازی کامل شد"
}

# ایجاد برنچ develop
create_develop() {
    print_header "ایجاد برنچ develop"
    
    if git show-ref --verify --quiet refs/heads/develop; then
        print_warning "برنچ develop از قبل وجود دارد"
        exit 1
    fi
    
    current_branch=$(git branch --show-current)
    
    # از main ایجاد می‌کنیم
    if git show-ref --verify --quiet refs/heads/main; then
        git checkout main
        git pull origin main
        git checkout -b develop
        git push -u origin develop
        print_success "برنچ develop ایجاد و به remote push شد"
    else
        print_error "برنچ main وجود ندارد"
        exit 1
    fi
    
    # به برنچ قبلی برمی‌گردیم
    git checkout "$current_branch" > /dev/null 2>&1
}

# ایجاد feature branch
create_feature() {
    print_header "ایجاد Feature Branch"
    
    if [ -z "$1" ]; then
        print_error "لطفاً نام feature را وارد کنید"
        echo "استفاده: $0 create-feature <feature-name>"
        exit 1
    fi
    
    feature_name="feature/$1"
    
    if git show-ref --verify --quiet "refs/heads/$feature_name"; then
        print_error "برنچ $feature_name از قبل وجود دارد"
        exit 1
    fi
    
    if ! git show-ref --verify --quiet refs/heads/develop; then
        print_error "برنچ develop وجود ندارد. ابتدا آن را ایجاد کنید: $0 create-develop"
        exit 1
    fi
    
    git checkout develop
    git pull origin develop
    git checkout -b "$feature_name"
    print_success "برنچ $feature_name ایجاد شد"
    echo -e "${BLUE}برای push کردن:${NC} git push -u origin $feature_name"
}

# نمایش راهنما
show_help() {
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}راهنمای مدیریت برنچ‌ها${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
    
    echo -e "${GREEN}دستورات:${NC}"
    echo -e "  ${YELLOW}status${NC}              نمایش وضعیت برنچ‌ها"
    echo -e "  ${YELLOW}cleanup${NC}             پاکسازی برنچ‌های merge شده"
    echo -e "  ${YELLOW}sync${NC}                همگام‌سازی با remote"
    echo -e "  ${YELLOW}create-develop${NC}      ایجاد برنچ develop"
    echo -e "  ${YELLOW}create-feature <name>${NC}  ایجاد feature branch"
    echo -e "  ${YELLOW}help${NC}                نمایش این راهنما"
    echo ""
    echo -e "${BLUE}مثال‌ها:${NC}"
    echo -e "  ./scripts/manage-branches.sh status"
    echo -e "  ./scripts/manage-branches.sh create-feature user-auth"
    echo -e "  ./scripts/manage-branches.sh cleanup"
}

# Main
check_git_repo

case "${1:-help}" in
    status)
        show_status
        ;;
    cleanup)
        cleanup_merged
        ;;
    sync)
        sync_remote
        ;;
    create-develop)
        create_develop
        ;;
    create-feature)
        create_feature "$2"
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        print_error "دستور نامعتبر: $1"
        echo ""
        show_help
        exit 1
        ;;
esac
