# url-file-version
check file version from url

## usage
used to find the latest version of a file from a website, which can be an ftp style listing or just in the web text.

```bash
Usage:  url-file-version [options]
```

| Options:     |                                                   |           |
| ------------ | ------------------------------------------------- | --------- |
| --version    | Show version number                               | [boolean] |
| -u, --url    | url to check for version                          | [required]|
| -p, --prefix | prefix of filename to check for, eg: u-boot for u-boot-2021.10.tar.bz2|[required] |
| -e, --ending | ending of filename to check for, eg: .tar.bz2 for u-boot-2021.10.tar.bz2|[required] |
| -b, --brief  | only output version number found                   | [boolean] |
| -h, --help   | Show help                                          | [boolean] |

## example
```bash
url-file-version --url https://ftp.denx.de/pub/u-boot/ --prefix u-boot --ending .tar.bz2
```
