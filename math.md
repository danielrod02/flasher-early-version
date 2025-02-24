# Some header
This is a formula in a paragraph: $$\frac{d}{dx} \left( f(g(x)) \right) = f'(g(x)) \cdot g'(x)$$
# Another header
```latex
\mathcal{F} \{a \cdot f(t) + b \cdot g(t)\} = a \cdot \mathcal{F} \{f(t)\} + b \cdot \mathcal{F} \{g(t)\}
```

```python
import os

def list_files_in_directory(directory):
    try:
        # List all files in the specified directory
        files = os.listdir(directory)
        print(f"Files in '{directory}':")
        for file in files:
            print(file)
    except FileNotFoundError:
        print(f"The directory '{directory}' does not exist.")
    except PermissionError:
        print(f"Permission denied to access '{directory}'.")
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    # Specify the directory to list files from
    directory = input("Enter the directory path: ")
    list_files_in_directory(directory)
```

# Well-Known Fourier Transforms

In this document, we present some of the well-known Fourier transforms of common functions. Each formula is enclosed between double dollar signs for proper rendering in LaTeX.

## 1. Fourier Transform of a Delta Function

The Fourier transform of the Dirac delta function \( \delta(t) \) is given by:
$$
\mathcal{F}\{\delta(t)\} = 1
$$

## 2. Fourier Transform of a Constant

The Fourier transform of a constant \( a \) is given by:
$$
\mathcal{F}\{a\} = a \cdot 2\pi \delta(\omega)
$$

## 3. Fourier Transform of an Exponential Function

The Fourier transform of \( e^{i \omega_0 t} \) is given by:
$$
\mathcal{F}\{e^{i \omega_0 t}\} = 2\pi \delta(\omega - \omega_0)
$$

## 4. Fourier Transform of a Sine Function

The Fourier transform of \( \sin(\omega_0 t) \) is given by:
$$
\mathcal{F}\{\sin(\omega_0 t)\} = \pi i \left[ \delta(\omega - \omega_0) - \delta(\omega + \omega_0) \right]
$$

## 5. Fourier Transform of a Cosine Function

The Fourier transform of \( \cos(\omega_0 t) \) is given by:
$$
\mathcal{F}\{\cos(\omega_0 t)\} = \pi \left[ \delta(\omega - \omega_0) + \delta(\omega + \omega_0) \right]
$$

## 6. Fourier Transform of a Rectangular Pulse

The Fourier transform of a rectangular pulse \( \text{rect}\left(\frac{t}{\tau}\right) \) is given by:
$$
\mathcal{F}\left\{\text{rect}\left(\frac{t}{\tau}\right)\right\} = \tau \cdot \text{sinc}\left(\frac{\omega \tau}{2\pi}\right)
$$

## 7. Fourier Transform of a Gaussian Function

The Fourier transform of a Gaussian function \( e^{-at^2} \) is given by:
$$
\mathcal{F}\{e^{-at^2}\} = \sqrt{\frac{\pi}{a}} e^{-\frac{\omega^2}{4a}}
$$

## 8. Fourier Transform of a Unit Step Function

The Fourier transform of the unit step function \( u(t) \) is given by:
$$
\mathcal{F}\{u(t)\} = \pi \delta(\omega) + \frac{1}{i\omega}
$$

## Conclusion

These are some of the most commonly used Fourier transforms in signal processing and other fields. The Fourier transform is a powerful tool for analyzing the frequency components of signals and functions.