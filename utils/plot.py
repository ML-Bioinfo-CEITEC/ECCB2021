# from tensorflow import keras as K
# import tensorflow as tf
import numpy as np
import pandas as pd

# imports below are only for plotting
import matplotlib.pyplot as plt
from sklearn.metrics import roc_curve, roc_auc_score
from sklearn.metrics import precision_recall_curve
from sklearn.metrics import auc, plot_precision_recall_curve
from matplotlib.pyplot import figure

def draw_precision_recall_curve(model, sequences, labels):
    probs = model.predict(sequences)
    precision, recall, thresholds = precision_recall_curve(labels, probs)
    plt.plot(recall, precision, marker='.', label='My model')
    plt.xlabel('Recall')
    plt.ylabel('Precision')
    plt.legend(loc="lower center")
    plt.title('Precision recall curve')
    auc_precision_recall = auc(recall, precision)
    print("AUC-PR:", auc_precision_recall)
    plt.show()


def ROC_curve(probs, labels):
    fpr, tpr, thresholds = roc_curve(labels, probs)
    auc_score = roc_auc_score(labels, probs)
    print("AUC score: ", auc_score)
    figure(num=None, figsize=(12, 9), dpi=80, facecolor='w', edgecolor='k')
    plt.plot(fpr, tpr, 'blue', label='My model')
    plt.axis([0, 1, 0, 1])
    plt.xlabel('False Positive Rate')
    plt.ylabel('True Positive Rate')
    plt.legend(loc="lower center")
    plt.title('ROC curve')
    plt.show()


def plot_history(history):
    """
    fun plots history of the training of the model,
    accuracy and loss of the training and validation set

    """
    acc = history.history['accuracy']
    val_acc = history.history['val_accuracy']
    loss = history.history['loss']
    val_loss = history.history['val_loss']

    epochs = range(1, len(acc) + 1)

    plt.plot(epochs, acc, 'bo', label='Training acc')
    plt.plot(epochs, val_acc, 'b', label='Validation acc')
    plt.title('Accuracy')
    plt.legend()
    plt.figure()

    plt.plot(epochs, loss, 'bo', label='Training loss')
    plt.plot(epochs, val_loss, 'b', label='Validation loss')
    plt.title('Loss')
    plt.legend()
    plt.show()
