function add_commit_push {
    git add .
    git commit -m "$1"
    git push --all
}

function throw_error {
    echo "Add a commit message!";
}

function cache_git {
    
    if [ -z "$1" ]
    then
        local time_to_store_credentials="300"
    else
        local time_to_store_credentials="$1"
    fi
    
    git config --global credential.helper "cache --timeout=$time_to_store_credentials"
}

if [ -z "$1" ]
then
    throw_error
    read -p "Message : " commit_message
    add_commit_push "$commit_message"
else
    cache_git "1800"
    add_commit_push "$1"
fi
